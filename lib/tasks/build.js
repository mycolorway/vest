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
    const taskNames = ['clean', 'template', 'babel', 'sass', 'file', 'npm']
    taskNames.forEach((name) => {
      require(`./build/${name}`).call(this, gulp)
    })

    gulp.task('build', gulp.series((done) => {
      utils.log(`start building project: ${this.config.projectName}(${this.config.env})`)
      done()
    }, taskNames, (done) => {
      utils.log(`finish building project: ${this.config.projectName}(${this.config.env})`)
      done()
    }))
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
