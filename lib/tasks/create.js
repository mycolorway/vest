const path = require('path')
const gulpPlumber = require('gulp-plumber')
const gulpReplace = require('gulp-replace')
const gulpRename = require('gulp-rename')
const {template} = require('./utils')
const BaseRegistry = require('./base')

class CreateTasksRegistry extends BaseRegistry {

  init(gulp) {
    gulp.task('create', () => {
      this.log(`start creating project...`)
      return gulp.src(this.templateGlobs, {
        cwd: this.config.basePath,
        dot: true
      }).pipe(gulpPlumber())
        .pipe(template(this.config))
        .pipe(gulpReplace(/<%%=([\s\S]+?)%>/g, function(match, p1) {
          return `<%=${p1}%>`
        }, { skipBinary: false }))
        .pipe(gulpRename((path) => {
          if (path.basename === '_package' && path.extname === '.json') {
            path.basename = 'package'
          }
        }))
        .pipe(gulp.dest(path.resolve(this.config.cwd, this.config.projectName)))
        .on('finish', () => this.log('project created'))
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
