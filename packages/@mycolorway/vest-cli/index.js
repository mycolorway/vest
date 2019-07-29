const program = require('commander')
const packageConfig = require('./package')

program.version(packageConfig.version, '-v --version')
  .usage('[command] [options]')

require('./lib/commands')

program.parse(process.argv)

if (!process.argv.slice(2).length) program.help()
