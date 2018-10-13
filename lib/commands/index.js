require('./create')
require('./build')
require('./dev')
require('./test')

const program = require('commander')
program.command('*', { noHelp: true })
  .action(() => program.help())
