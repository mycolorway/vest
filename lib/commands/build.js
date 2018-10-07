const config = require('../config')
const DevCommand = require('./dev')

class BuildCommand extends DevCommand {

  constructor() {
    super()
    this.initBuildEnv()
  }

  get taskName() {
    return 'build'
  }

  initBuildEnv() {
    Object.assign(this.config, {
      env: config.env === 'development' ? 'production' : config.env
    })
  }

}

module.exports = BuildCommand
