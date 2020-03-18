const {template, resolveProjectPath} = require('../utils')
const gulpPlumber = require('gulp-plumber')

module.exports = function(gulp) {
  gulp.task(`${this.config.name}:template`, () => {
    const fileType = this.config.platform === 'feishu' ? 'ttml' : 'wxml';
    this.log(`start compiling ${fileType} files...`)
    return gulp.src(this.templateGlobs, { base: this.config.srcPath })
      .pipe(gulpPlumber())
      .pipe(template(this.config))
      .pipe(resolveProjectPath())
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish compiling ${fileType} files.`))
  })
}
