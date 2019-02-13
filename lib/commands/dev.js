const path = require('path')
const program = require('commander')
const {runTask, getBuildConfig, ensureDependenciesInstalled} = require('./utils')
const {resolveDependencies} = require('../tasks/utils')
const config = require('../config')

program.command('dev')
  .description('build the vest project in development env and then watch file changes.')
  .option('-l, --lark', 'Build project for the lark platform')
  .action(async (cmd) => {
    await ensureDependenciesInstalled(config.cwd)

    const buildConfig = getBuildConfig(config)
    const buildTasks = [Object.assign({}, buildConfig, {
      name: {
        'miniprogram': 'build',
        'miniprogram-node-package': 'build-node-package'
      }[buildConfig.projectType],
      env: 'development',
      watch: true,
      lark: cmd.lark
    })]

    if (buildConfig.projectType === 'miniprogram-node-package') {
      const demoPath = path.resolve(buildConfig.cwd, 'demo')
      await ensureDependenciesInstalled(demoPath)
      buildTasks.push(Object.assign({}, buildConfig, {
        name: 'build',
        projectName: `${buildConfig.projectName}-demo`,
        env: 'development',
        watch: true,
        cwd: demoPath,
        useESLint: false,
        srcPath: path.resolve(buildConfig.cwd, 'demo/src'),
        distPath: path.resolve(buildConfig.cwd, 'demo/dist'),
        extraDependencies: Object.assign({
          [buildConfig.projectName]: buildConfig.cwd
        }, resolveDependencies(buildConfig.cwd))
      }))
    }

    runTask(...buildTasks)
  })
