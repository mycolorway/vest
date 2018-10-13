const DefaultRegistry = require('undertaker-registry')
const {log} = require('./utils')

class BaseRegistry extends DefaultRegistry {

  constructor(config) {
    super()
    this.config = config
  }

  init(gulp) {
  }

  log(message) {
    log(message, this.config.projectName)
  }

}

module.exports = BaseRegistry
