module.exports = function(gulp) {
  gulp.task(`${this.config.name}:file`, () => {
    this.log(`start coping other files...`)
    return gulp.src(this.fileGlobs, {
      base: this.config.srcPath,
      dot: true
    }).pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish coping other files.`))
  })
}
