const path = require('path')
const gulpPlumber = require('gulp-plumber')
const gulpReplace = require('gulp-replace')
const utils = require('./utils')
const BaseRegistry = require('./base')

class CreateTasksRegistry extends BaseRegistry {

  init(gulp) {
    gulp.task('create', () => {
      utils.log(`start creating project: ${this.config.projectName}`)
      return gulp.src(this.templateGlobs, {
        cwd: this.config.basePath,
        dot: true
      }).pipe(gulpPlumber())
        .pipe(utils.template(this.config))
        .pipe(gulpReplace(/<%%=([\s\S]+?)%>/g, function(match, p1) {
          return `<%=${p1}%>`
        }, { skipBinary: false }))
        .pipe(gulp.dest(path.resolve(this.config.cwd, this.config.projectName)))
        .on('finish', function() {
          utils.log('project created')
        })
    })
  }

  get templateGlobs() {
    return this._templateGlobs || (() => {
      const globs = [`templates/${this.config.projectType}/**/*`]
      if (!this.config.useESLint) {
        globs.push(`!templates/${this.config.projectType}/.eslintrc.js`)
      }
      return globs
    })()
  }

}

module.exports = CreateTasksRegistry
