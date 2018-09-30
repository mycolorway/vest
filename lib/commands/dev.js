const BaseCommand = require('./base')

class DevCommand extends BaseCommand {

  get taskName() {
    return 'dev'
  }

}

module.exports = DevCommand
