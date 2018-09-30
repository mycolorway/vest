const config = require('../config')
const BaseCommand = require('./base')

class BuildCommand extends BaseCommand {

  constructor() {
    super()
    Object.assign(this.config, {
      env: config.env === 'development' ? 'production' : config.env
    })
  }

  get taskName() {
    return 'build'
  }

}

module.exports = BuildCommand
