const gulp = require('gulp');
const vinylYamlData = require('vinyl-yaml-data');
const deepExtend = require('deep-extend-stream');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const argv = require('yargs').argv;
const fs = require('fs');
const jsYaml = require('js-yaml');
const lodash = require('lodash');
const oMerge = require('object-merge');
const $ = require('gulp-load-plugins')();
const marked = require('marked');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-buffer');
require('es6-promise').polyfill();
require('dotenv').config();
let templateData;

const config = {
  defaultPort: 3000,
  environment: argv.environment || 'local',
  minify: argv.minify || false,
  gaTrackingId: process.env.GA_TRACKING_ID,
  paths: {
    src: './src',
    dist: './dist',
    data: './src/data',
    gulpTasks: './gulp/tasks',
    templates: './src/templates/pages',
    srcImages: './src/assets/images',
    srcStyles: './src/assets/styles',
    srcScripts: './src/assets/scripts',
    distImages: './dist/assets/images',
    distStyles: './dist/assets/styles',
    distScripts: './dist/assets/scripts'
  }
}


gulp.task('templateData', (cb) => {
  templateData = {};
  let stream = gulp.src(config.paths.data + '/**/*.y{,a}ml')
    .pipe(vinylYamlData())
    .pipe(deepExtend(templateData));
  return stream;
});


gulp.task('clean', (cb) => {
  return gulp.src(config.paths.dist+ '/*', {read: false}).pipe($.clean());
});


gulp.task('images', (cb) => {
  let stream = gulp.src([config.paths.srcImages + '/**/*'])
    .pipe($.plumber({
        handleError: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest(config.paths.distImages))
    .pipe(browserSync.reload({stream:true}));
  return stream;
});



gulp.task('scripts', (cb) => {
  let stream = browserify([config.paths.srcScripts + '/index.js'])
    .transform(babelify.configure({
      presets: ['es2015']
    })).bundle()
    .pipe(source('app.js'))
    .pipe($.plumber({
        handleError: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    // .pipe($.concat('main.js'))
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.browserify())
    .pipe(gulp.dest(config.paths.distScripts))
    .pipe($.if(config.minify, $.rename({
        suffix: '.min'
    })))
    .pipe($.if(config.minify, $.uglify()))
    .pipe(gulp.dest(config.paths.distScripts))
    .pipe(browserSync.reload({stream:true}));

  return stream;
});



gulp.task('styles', (cb) => {
  let stream = gulp.src([config.paths.srcStyles  + '/main.scss'])
      .pipe($.plumber({
          handleError: function (err) {
              console.log(err);
              this.emit('end');
          }
      }))
      .pipe($.sourcemaps.init())
      .pipe($.sass({
          includePaths: [
            require('node-bourbon').includePaths,
            require('node-neat').includePaths
          ]
      }))
      .pipe($.autoprefixer())
      .pipe($.csscomb())
      .pipe($.mergeMediaQueries({log:true}))
      .pipe($.csslint())
      // .pipe($.csslint.reporter())
      .pipe(gulp.dest(config.paths.distStyles))
      .pipe($.if(config.minify, $.rename({
          suffix: '.min'
      })))
      .pipe($.if(config.minify, $.cleanCss()))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(config.paths.distStyles))
      .pipe(browserSync.reload({stream:true}));

  return stream;
});


gulp.task('templates', ['templateData'], (cb) => {
  let oData = Object.assign(config, templateData);
  /* Insert any specific data manipulatiopn here */
  let stream = gulp.src([config.paths.templates + '/**/*.pug'])
    .pipe($.plumber({
        handleError: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe($.pug({locals: { marked: marked }, data: oData}))
    .pipe($.if(config.minify, $.minifyHtml()))
    .pipe(gulp.dest(config.paths.dist))
    .pipe(browserSync.reload({stream:true}));
  return stream;
});


gulp.task('watch', (cb) => {
  browserSync.init({
      port: config.defaultPort,
      server: config.paths.dist
  });
  gulp.watch(config.paths.srcScripts + '/**/*.js',['scripts']);
  gulp.watch(config.paths.srcStyles + '/**/*.scss',['styles']);
  gulp.watch([config.paths.templates + '/**/*.pug', config.paths.data + '/**/*.yaml'],['templates']);
  gulp.watch(config.paths.srcImages + '/**/*',['images']);
});


//  Build to ./dist & Serve on localhost:3000
gulp.task('dev', (cb) => {
  runSequence(
    'default',
    'watch',
    cb
  );
});

// Build site to ./dist
gulp.task('default', (cb) => {
  runSequence(
    'clean',
    ['styles', 'scripts', 'templates', 'images'],
    cb
  );
});
