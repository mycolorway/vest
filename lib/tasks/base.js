const DefaultRegistry = require('undertaker-registry')

class BaseRegistry extends DefaultRegistry {

  constructor(config) {
    super()
    this.config = config
  }

  init(gulp) {
  }

}

module.exports = BaseRegistry
