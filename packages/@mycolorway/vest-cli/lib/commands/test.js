const program = require('commander')
const {ensureDependenciesInstalled} = require('./utils')
const config = require('../config')


program.command('test')
  .allowUnknownOption(true)
  .description('run unit tests with Jest. All Jest command line options are supported.')
  .action(async (cmd) => {
    await ensureDependenciesInstalled(config.cwd)
      if (process.env.NODE_ENV == null) {
        process.env.NODE_ENV = 'test';
      }
      require('jest').run(cmd.parent.rawArgs.slice(3))
    })
