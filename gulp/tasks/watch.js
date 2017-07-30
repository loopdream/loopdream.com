module.exports = (gulp, config, $, data) => {
  return () => {
    $.bs.init({
        port: config.defaultPort,
        server: config.paths.dist
    });
    gulp.watch(config.paths.srcStyles + '/**/*.js',['scripts']);
    gulp.watch(config.paths.srcStyles + '/**/*.scss',['styles']);
    gulp.watch(config.paths.templates + '/**/*.pug',['templates']);
    gulp.watch(config.paths.srcImages + '/**/*',['images']);
    gulp.watch(config.paths.data + '/**/*.yaml',['default']);
  };
};
