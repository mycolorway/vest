const fs = require('fs')
const path = require('path')
const program = require('commander')
const {runTask, getBuildConfig, ensureDependenciesInstalled} = require('./utils')
const config = require('../config')

program.command('build')
  .description('build the vest project in current working directory.')
  .option('-e, --env [env]', 'Build project in specified environment, default is [production]', 'production')
  .option('-w, --watch', 'Watch file changes after building')
  .action(async (cmd) => {
    await ensureDependenciesInstalled(config.cwd)
    runTask(Object.assign({}, getBuildConfig(config), {
      name: 'build',
      env: cmd.env,
      watch: cmd.watch
    }))
  })
