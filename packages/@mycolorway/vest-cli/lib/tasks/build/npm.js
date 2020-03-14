const fs = require('fs')
const path = require('path')
const gulpPlumber = require('gulp-plumber')
const rollup = require('rollup')
const gulpRollup = require('gulp-better-rollup')
const rollupCommonjs = require('rollup-plugin-commonjs')
const rollupNodeResolve = require('rollup-plugin-node-resolve')
const gulpBabel = require('gulp-babel')
const gulpRename = require('gulp-rename')
const {resolveDependencies, resolveNodePath} = require('../utils')
const {getMiniprogramDistPath} = require('../../commands/utils')

module.exports = function(gulp) {
  const vendorDependencies = getVendorDependencies(path.resolve(this.config.cwd, 'src/vendor'));
  const dependencies = Object.assign(
    resolveDependencies(this.config.cwd, {
      ignoreDependencies: Object.keys(vendorDependencies),
    }),
    vendorDependencies,
    this.config.extraDependencies
  );
  const dependencyNames = Object.keys(dependencies)
  const npmTasks = dependencyNames.reduce((result, dependencyName) => {
    const modulePath = dependencies[dependencyName]
    if (!fs.existsSync(modulePath)) return result

    const taskName = `${this.config.name}:npm-${dependencyName}`
    gulp.task(taskName, (done) => {
      this.log(`start compiling ${dependencyName} files...`) 

      const mpDistPath = getMiniprogramDistPath(modulePath)
      if (mpDistPath && fs.existsSync(mpDistPath)) {
        return transformMiniprogramPackage({
          gulp,
          build: this,
          name: dependencyName,
          packagePath: mpDistPath,
        })
      } else {
        return transformNodePackage({
          gulp,
          build: this,
          name: dependencyName,
          packagePath: modulePath,
          externals: dependencyNames.filter((name) => !vendorDependencies[name]),
          done,
        })
      }
    });

    result.push(taskName)
    return result
  }, [])

  gulp.task(`${this.config.name}:npm`, npmTasks.length > 0 ? gulp.parallel(npmTasks) : function(done) {
    done()
  })
}

function getVendorDependencies(vendorPath) {
  if (!fs.existsSync(vendorPath)) return {};
  return fs.readdirSync(vendorPath).reduce((result, file) => {
    const dependencyPath = path.resolve(vendorPath, file);
    const dependencyName = path.basename(dependencyPath, '.js');
    result[dependencyName] = dependencyPath;
    return result;
  }, {});
}

function transformMiniprogramPackage({ gulp, build, name, packagePath }) {
  return gulp.src(path.join(packagePath, '**/*'))
    .pipe(gulp.dest(path.join(build.config.distPath, 'miniprogram_npm', name)))
    .on('finish', () => build.log(`finish compiling ${name} package files.`))
}

function transformNodePackage({ gulp, build, name, packagePath, externals, done}) {
  let entryFilePath;
  if (fs.statSync(packagePath).isDirectory()) {
    const dependencyConfig = require(path.resolve(packagePath, 'package.json'))
    entryFilePath = require.resolve(path.resolve(packagePath, dependencyConfig.main || 'index.js'))
  } else {
    entryFilePath = packagePath;
  }

  if (fs.existsSync(entryFilePath)) {
    return gulp.src(entryFilePath)
      .pipe(gulpPlumber())
      .pipe(gulpRollup({
        rollup: rollup,
        external: externals,
        plugins: [
          rollupNodeResolve({
            modulesOnly: true
          }),
          rollupCommonjs({
            sourceMap: false
          }),
        ],
      }, {
        format: 'es'
      }))
      .pipe(gulpBabel({
        rootMode: 'upward',
        comments: false,
        compact: true
      }))
      .pipe(gulpRename({
        basename: 'index',
        extname: '.js'
      }))
      .pipe(resolveNodePath({
        projectType: 'miniprogram-node-package',
        projectName: name,
      }))
      .pipe(gulp.dest(path.join(build.config.distPath, 'miniprogram_npm', name)))
      .on('finish', () => build.log(`finish compiling ${name} package files.`))
    } else {
      build.log(`finish compiling ${name} package files.`)
      done()
    }
}