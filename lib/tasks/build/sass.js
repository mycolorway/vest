const gulpSass = require('gulp-sass')
const gulpRename = require('gulp-rename')
const gulpReplace = require('gulp-replace')
const gulpPlumber = require('gulp-plumber')
const sassPackageImporter = require('node-sass-package-importer')
const utils = require('../utils')

module.exports = function(gulp) {
  gulp.task(`${this.config.name}:sass`, () => {
    utils.log(`start compiling scss files...`)
    return gulp.src(this.sassGlobs)
      .pipe(gulpPlumber())
      .pipe(utils.template(this.config))
      .pipe(gulpSass({
        includePaths: [this.config.srcPath],
        importer: [
          utils.sassProjectImporter(this.config),
          sassPackageImporter()
        ]
      }))
      .pipe(utils.resolvePath())
      .pipe(gulpReplace(/\/\*=\s+import\s+'(.+)'\s+\*\//g, '@import \'$1\';'))
      .pipe(gulpRename({
        extname: ".wxss"
      }))
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => utils.log(`finish compiling scss files.`))
  })
}
