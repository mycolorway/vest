const BaseCommand = require('./base')

class HelpCommand extends BaseCommand {

  run() {
    console.log(`available commands: create dev build help`)
  }
}

module.exports = HelpCommand
