const gulp = require('gulp');
const vinylYamlData = require('vinyl-yaml-data');
const deepExtend = require('deep-extend-stream');
let data;
/* Create a global object of gulp + node plugins */
const $ = Object.assign({
  bs:     require('browser-sync').create(),
  rs:     require('run-sequence'),
  argv:   require('yargs').argv,
  fs:     require('fs'),
  yaml:   require('js-yaml'),
  lodash: require('lodash'),
  oMerge: require('object-merge')
}, require('gulp-load-plugins')());

require('es6-promise').polyfill();

const config = {
  defaultPort: 3000,
  environment: $.argv.environment || 'local',
  minify: $.argv.minify || false,
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

let setDataObject = () => {
  data = {};
  return gulp.src(config.paths.data + '/**/*.y{,a}ml')
    .pipe(vinylYamlData())
    .pipe(deepExtend(data));
}

//  Load Tasks
let loadTask = (task) => {
  return require(config.paths.gulpTasks + task)(gulp, config, $, data);
}

setDataObject();
gulp.task('clean', loadTask('/clean'));
gulp.task('styles', loadTask('/styles'));
gulp.task('scripts', loadTask('/scripts'));
gulp.task('templates', loadTask('/templates'));
gulp.task('images', loadTask('/images'));
gulp.task('watch', loadTask('/watch'));

//  Build & Serve on localhost:3000
gulp.task('dev', (cb) => {
  $.rs(
    'default',
    'watch',
    cb
  );
});

// Build site
gulp.task('default', (cb) => {
  $.rs(
    'clean',
    ['styles', 'scripts', 'templates', 'images'],
    cb
  );
});
