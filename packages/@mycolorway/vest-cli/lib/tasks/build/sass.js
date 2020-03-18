const gulpSass = require('gulp-sass')
const gulpRename = require('gulp-rename')
const gulpReplace = require('gulp-replace')
const gulpPlumber = require('gulp-plumber')
const sassPackageImporter = require('node-sass-package-importer')
const {template, sassProjectImporter, resolveProjectPath} = require('../utils')

gulpSass.compiler = require('node-sass');

module.exports = function(gulp) {
  const sassConfig = this.config.sass || {};
  gulp.task(`${this.config.name}:sass`, () => {
    const fileType = this.config.platform === 'feishu' ? 'ttss' : 'wxss';
    this.log(`start compiling scss files...`)
    return gulp.src(this.sassGlobs)
      .pipe(gulpPlumber())
      .pipe(template(this.config))
      .pipe(gulpSass({
        includePaths: [this.config.srcPath],
        importer: [
          sassProjectImporter(this.config),
          sassPackageImporter({
            cwd: this.config.cwd
          })
        ],
        functions: sassConfig.functions
      }))
      .pipe(resolveProjectPath())
      .pipe(gulpReplace(/\/\*=\s+import\s+'(.+)'\s+\*\//g, '@import \'$1\';'))
      .pipe(gulpRename({
        extname: `.${fileType}`,
      }))
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish compiling scss files.`))
  })
}
