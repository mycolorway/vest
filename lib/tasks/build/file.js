const utils = require('../utils')

module.exports = function(gulp) {
  gulp.task('file', () => {
    utils.log(`start coping other files...`)
    return gulp.src(this.fileGlobs, {
      base: this.config.srcPath,
      dot: true
    }).pipe(gulp.dest(this.config.distPath))
      .on('finish', () => utils.log(`finish coping other files.`))
  })
}
