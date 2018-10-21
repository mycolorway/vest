const gulpBabel = require('gulp-babel')
const gulpPlumber = require('gulp-plumber')
const gulpEslint = require('gulp-eslint')
const gulpIf = require('gulp-if')
const utils = require('../utils')

module.exports = function(gulp) {
  gulp.task(`${this.config.name}:babel`, () => {
    this.log(`start compiling js files...`)
    return gulp.src(this.babelGlobs, { base: this.config.srcPath })
      .pipe(gulpPlumber())
      .pipe(gulpIf(this.config.useESLint, gulpEslint()))
      .pipe(gulpIf(this.config.useESLint, gulpEslint.format()))
      .pipe(utils.template(this.config))
      .pipe(gulpBabel({
        rootMode: 'upward'
      }))
      .pipe(utils.resolvePath())
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish compiling js files.`))
  })
}
