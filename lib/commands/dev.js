const program = require('commander')
const {runTask, getBuildConfig, ensureDependenciesInstalled} = require('./utils')
const {resolveDependencies} = require('../tasks/utils')
const config = require('../config')

program.command('dev')
  .description('build the vest project in development env and then watch file changes.')
  .action(async (cmd) => {
    await ensureDependenciesInstalled(config.cwd)

    const buildConfig = getBuildConfig(config)
    const buildTasks = [Object.assign({}, buildConfig, {
      name: 'build-node-package',
      env: 'development',
      watch: true
    })]

    if (buildConfig.projectType === 'miniprogram-node-package') {
      buildTasks.push(Object.assign({}, buildConfig, {
        name: 'build',
        env: 'development',
        watch: true,
        cwd: path.resolve(buildConfig.cwd, 'demo'),
        srcPath: path.resolve(buildConfig.cwd, 'demo/src'),
        distPath: path.resolve(buildConfig.cwd, 'demo/dist'),
        extraDependencies: Object.assign({
          [buildConfig.projectName]: buildConfig.cwd
        }, resolveDependencies(buildConfig.cwd))
      }))
    }

    runTask(...buildTasks)
  })
