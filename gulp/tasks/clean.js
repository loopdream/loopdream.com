module.exports = (gulp, config, $, data) => {
    return () => {
    	return gulp.src(config.paths.dist+ '/*', {read: false}).pipe($.clean());
    };
};
