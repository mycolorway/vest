const BuildTasksRegistry = require('./build')

class DevTasksRegistry extends BuildTasksRegistry {

  init(gulp) {
    super(gulp)

    gulp.task('watch',(done) => {
      gulp.watch(this.templateGlobs, gulp.task('template'))
      gulp.watch(this.babelGlobs, gulp.task('babel'))
      gulp.watch(this.sassGlobs, gulp.task('sass'))
      gulp.watch(this.fileGlobs, gulp.task('file'))
      done()
    })

    gulp.task('dev', gulp.series(['build', 'watch']))
  }

}

module.exports = DevTasksRegistry
