const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')
const utils = require('./utils')
const BaseRegistry = require('./base')

class BuildTasksRegistry extends BaseRegistry {

  constructor(config) {
    super(config)

    let envPath = path.resolve(this.config.cwd, `.env.${this.config.env}`)
    if (!fs.existsSync(envPath)) envPath = path.resolve(this.config.cwd, '.env')
    const envVariables = require('dotenv').config({ path: envPath }).parsed
    Object.assign(this.config, envVariables)
  }

  init(gulp) {
    ['clean', 'template', 'babel', 'sass', 'file', 'npm'].forEach((name) => {
      require(`./build/${name}`).call(this, gulp)
    })

    gulp.task('watch',(done) => {
      utils.log('start watching file changes...')
      gulp.watch(this.templateGlobs, gulp.task('template'))
      gulp.watch(this.babelGlobs, gulp.task('babel'))
      gulp.watch(this.sassGlobs, gulp.task('sass'))
      gulp.watch(this.fileGlobs, gulp.task('file'))
      done()
    })

    const buildTasks = [(done) => {
      utils.log(`start building project: ${this.config.projectName}(${this.config.env})`)
      done()
    }, 'clean', gulp.parallel('template', 'babel', 'sass', 'file', 'npm'), (done) => {
      utils.log(`finish building project: ${this.config.projectName}(${this.config.env})`)
      done()
    }]
    if (this.config.watch) buildTasks.push('watch')
    gulp.task('build', gulp.series(buildTasks))
  }

  get fileGlobs() {
    return this._fileGlobs = this._fileGlobs || [
      path.join(this.config.srcPath, '**/*'),
      '!' + path.join(this.config.srcPath, '**/*.wxml'),
      '!' + path.join(this.config.srcPath, '**/*.json'),
      '!' + path.join(this.config.srcPath, '**/*.scss'),
      '!' + path.join(this.config.srcPath, '**/*.js')
    ]
  }

  get templateGlobs() {
    return this._templateGlobs = this._templateGlobs || [
      path.join(this.config.srcPath, '**/*.wxml'),
      path.join(this.config.srcPath, '**/*.json')
    ]
  }

  get babelGlobs() {
    return this._babelGlobs = this._babelGlobs || [
      path.join(this.config.srcPath, '**/*.js')
    ]
  }

  get sassGlobs() {
    return this._sassGlobs = this._sassGlobs || [
      path.join(this.config.srcPath, '**/*.scss')
    ]
  }

  get babelOptions() {
    return this._babelOptions = this._babelOptions || {
      "cwd": this.config.basePath,
      "presets": [
        ["@babel/preset-env", {
          "modules": false,
          "targets": {
            "browsers": ["> 1%", "last 2 versions"]
          }
        }]
      ],
      "plugins": [
        "@babel/plugin-transform-modules-commonjs",
        babel.createConfigItem(require('./build/babel/transform-runtime'))
      ]
    }
  }
}

module.exports = BuildTasksRegistry
