const fs = require('fs')
const path = require('path')
const program = require('commander')
const {runTask, getBuildConfig, ensureDependenciesInstalled} = require('./utils')
const config = require('../config')

program.command('build')
  .description('build the vest project in current working directory.')
  .option('-e, --env [env]', 'Build project in specified environment, default is [production]', 'production')
  .option('-w, --watch', 'Watch file changes after building')
  .option('-l, --lark', 'Build project for the lark platform')
  .action(async (cmd) => {
    await ensureDependenciesInstalled(config.cwd)
    const buildConfig = getBuildConfig(config)
    runTask(Object.assign({}, buildConfig, {
      name: {
        'miniprogram': 'build',
        'miniprogram-node-package': 'build-node-package'
      }[buildConfig.projectType],
      env: cmd.env,
      watch: cmd.watch,
      lark: cmd.lark
    }))
  })
