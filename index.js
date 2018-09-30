const config = require('./lib/config')
const { findCommand } = require('./lib/commands')

const Command = findCommand(config._[0] || 'help')
new Command().run()
