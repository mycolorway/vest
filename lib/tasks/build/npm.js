const fs = require('fs')
const path = require('path')
const gulpPlumber = require('gulp-plumber')
const rollup = require('rollup')
const gulpRollup = require('gulp-better-rollup')
const rollupCommonjs = require('rollup-plugin-commonjs')
const rollupNodeResolve = require('rollup-plugin-node-resolve')
const gulpBabel = require('gulp-babel')
const gulpRename = require('gulp-rename')
const utils = require('../utils')

module.exports = function(gulp) {
  const packageConfig = require(path.resolve(this.config.cwd, 'package.json'))
  const npmTasks = Object.keys(packageConfig.dependencies).reduce((result, dependencyName) => {
    const modulePath = path.resolve(this.config.cwd, 'node_modules', dependencyName)
    if (!fs.existsSync(modulePath)) return result
    const dependencyConfig = require(path.resolve(modulePath, 'package.json'))

    let mpDistPath = null
    if (dependencyConfig.miniprogram) {
      mpDistPath = path.resolve(modulePath, dependencyConfig.miniprogram)
    } else {
      mpDistPath = path.resolve(modulePath, 'miniprogram_dist')
    }

    if (mpDistPath && fs.existsSync(mpDistPath)) {
      gulp.task(`npm-${dependencyName}`, () => {
        utils.log(`start compiling ${dependencyName} files...`)
        return gulp.src(path.join(mpDistPath, '**/*'))
          .dist(path.join(this.config.distPath, 'miniprogram_npm', dependencyName))
          .on('finish', () => utils.log(`finish compiling ${dependencyName} package files.`))
      })
      result.push(`npm-${dependencyName}`)
    } else {
      const entryFilePath = path.resolve(modulePath, dependencyConfig.main || 'index.js')
      if (fs.existsSync(entryFilePath)) {
        gulp.task(`npm-${dependencyName}`, () => {
          utils.log(`start compiling ${dependencyName} files...`)
          return gulp.src(entryFilePath)
            .pipe(gulpPlumber())
            .pipe(utils.template(this.config))
            .pipe(gulpRollup({
              rollup: rollup,
              plugins: [
                rollupNodeResolve(),
                rollupCommonjs({
                  include: 'node_modules/**',
                  sourceMap: false
                })
              ]
            }, {
              format: 'es'
            }))
            .pipe(gulpBabel(Object.assign({}, this.babelOptions, {
              comments: false,
              compact: true
            })))
            .pipe(gulpRename({
              basename: 'index',
              extname: '.js'
            }))
            .pipe(gulp.dest(path.join(this.config.distPath, 'miniprogram_npm', dependencyName)))
            .on('finish', () => utils.log(`finish compiling ${dependencyName} package files.`))
        })
        result.push(`npm-${dependencyName}`)
      }
    }
    return result
  }, [])

  gulp.task('npm', npmTasks.length > 0 ? gulp.parallel(npmTasks) : function(done) {
    done()
  })
}
