module.exports = (gulp, config, $, data) => {

    return () => {
        // merge config with data
        let templateData = Object.assign(config, data);
        /* Insert any specific data manipulatiopn here */
    	  let stream = gulp.src([config.paths.templates + '/**/*.pug'])
        .pipe($.plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe($.pug({pretty: true, data: templateData}))
        .pipe($.if(config.minify, $.minifyHtml()))
        .pipe(gulp.dest(config.paths.dist))
        .pipe($.bs.reload({stream:true}));

    	return stream;

    };
};
