const fs = require('fs')
const path = require('path')
const {getMiniprogramDistPath} = require('../commands/utils')
const BaseRegistry = require('./base')

class BuildTasksRegistry extends BaseRegistry {

  constructor(config) {
    super(config)

    let envPath = path.resolve(this.config.cwd, `.env.${this.config.env}`)
    if (!fs.existsSync(envPath)) envPath = path.resolve(this.config.cwd, '.env')
    if (fs.existsSync(envPath)) {
      const envVariables = require('dotenv').config({ path: envPath }).parsed
      Object.assign(this.config, envVariables)
    }
  }

  init(gulp) {
    ['clean', ...this.taskNames].forEach((name) => {
      require(`./build/${name}`).call(this, gulp)
    })

    gulp.task(`${this.config.name}:watch`,(done) => {
      gulp.watch(this.templateGlobs, gulp.task(`${this.config.name}:template`))
      gulp.watch(this.babelGlobs, gulp.task(`${this.config.name}:babel`))
      gulp.watch(this.sassGlobs, gulp.task(`${this.config.name}:sass`))
      gulp.watch(this.copyGlobs, gulp.task(`${this.config.name}:copy`))
      if (this.config.extraDependencies) {
        Object.entries(this.config.extraDependencies).forEach(([dependencyName, modulePath]) => {
          const mpDistPath = getMiniprogramDistPath(modulePath)
          if (fs.existsSync(mpDistPath)) {
            gulp.watch(path.resolve(mpDistPath, '**/*'), gulp.task(`${this.config.name}:npm-${dependencyName}`))
          }
        })
      }
      this.log('start watching file changes...')
      done()
    })

    const buildTasks = [
      (done) => {
        this.log(`start building project in env: ${this.config.env}`)
        done()
      },
      `${this.config.name}:clean`,
      gulp.parallel(this.taskNames.map(name => `${this.config.name}:${name}`)),
      (done) => {
        this.log('finish building project.')
        done()
      }
    ]
    if (this.config.watch) buildTasks.push(`${this.config.name}:watch`)
    gulp.task(this.config.name, gulp.series(buildTasks))
  }

  get taskNames() {
    return ['template', 'babel', 'sass', 'json', 'copy', 'npm']
  }

  get copyGlobs() {
    return this._copyGlobs = this._copyGlobs || [
      path.join(this.config.srcPath, '**/*'),
      '!' + path.join(this.config.srcPath, '**/*.wxml'),
      '!' + path.join(this.config.srcPath, '**/*.json'),
      '!' + path.join(this.config.srcPath, '**/*.scss'),
      '!' + path.join(this.config.srcPath, '**/*.js')
    ]
  }

  get jsonGlobs() {
    return this._jsonGlobs = this._jsonGlobs || [
      path.join(this.config.srcPath, '**/*.json')
    ]
  }

  get templateGlobs() {
    return this._templateGlobs = this._templateGlobs || [
      path.join(this.config.srcPath, '**/*.wxml'),
    ]
  }

  get babelGlobs() {
    return this._babelGlobs = this._babelGlobs || [
      path.join(this.config.srcPath, '**/*.js'),
      '!' + path.join(this.config.srcPath, 'vendor/**/*.js'),
    ]
  }

  get sassGlobs() {
    return this._sassGlobs = this._sassGlobs || [
      path.join(this.config.srcPath, '**/*.scss')
    ]
  }

}

module.exports = BuildTasksRegistry
