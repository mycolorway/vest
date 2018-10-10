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

function resolveDependencies(cwd, modulePath = cwd) {
  const packageConfig = require(path.resolve(modulePath, 'package.json'))
  const dependencyNames = packageConfig.dependencies ? Object.keys(packageConfig.dependencies) : []

  return dependencyNames.reduce((dependencies, dependencyName) => {
    const modulePath = path.resolve(cwd, 'node_modules', dependencyName)
    return Object.assign(dependencies, {
      [dependencyName]: modulePath
    }, resolveDependencies(cwd, modulePath))
  }, {})
}

module.exports = function(gulp) {
  const dependencies = resolveDependencies(this.config.cwd)
  const dependencyNames = Object.keys(dependencies)
  const npmTasks = dependencyNames.reduce((result, dependencyName) => {
    const modulePath = dependencies[dependencyName]
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
          .pipe(gulp.dest(path.join(this.config.distPath, 'miniprogram_npm', dependencyName)))
          .on('finish', () => utils.log(`finish compiling ${dependencyName} package files.`))
      })
      result.push(`npm-${dependencyName}`)
    } else {
      const entryFilePath = require.resolve(path.resolve(modulePath, dependencyConfig.main || 'index.js'))
      if (fs.existsSync(entryFilePath)) {
        gulp.task(`npm-${dependencyName}`, () => {
          utils.log(`start compiling ${dependencyName} files...`)
          return gulp.src(entryFilePath)
            .pipe(gulpPlumber())
            .pipe(utils.template(this.config))
            .pipe(gulpRollup({
              rollup: rollup,
              external: dependencyNames,
              plugins: [
                rollupNodeResolve({
                  modulesOnly: true
                }),
                rollupCommonjs({
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
