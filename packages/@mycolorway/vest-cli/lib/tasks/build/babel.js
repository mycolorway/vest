const gulpBabel = require('gulp-babel')
const babel = require('@babel/core');
const gulpPlumber = require('gulp-plumber')
const gulpEslint = require('gulp-eslint')
const gulpIf = require('gulp-if')
const { resolveProjectPath, resolveNodePath, template } = require('../utils')

module.exports = function(gulp) {
  gulp.task(`${this.config.name}:babel`, () => {
    this.log(`start compiling js files...`)
    return gulp.src(this.babelGlobs, { base: this.config.srcPath })
      .pipe(gulpPlumber())
      .pipe(gulpIf(this.config.useESLint, gulpEslint()))
      .pipe(gulpIf(this.config.useESLint, gulpEslint.format()))
      .pipe(template(this.config))
      .pipe(gulpBabel({
        rootMode: 'upward',
        plugins: [
          babel.createConfigItem(require('./babel/plugins/transform-runtime')),
          babel.createConfigItem(require('./babel/plugins/transform-node-import')),
        ],
      }))
      .pipe(resolveProjectPath())
      .pipe(resolveNodePath(this.config))
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish compiling js files.`))
  })
}
