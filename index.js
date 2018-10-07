const fs = require('fs')
const path = require('path')
const program = require('commander')
const gulp = require('gulp')
const packageConfig = require('./package')
const config = require('./lib/config')
const _ = require('lodash')

function runTask(name, config) {
  const TaskRegistry = require(`./lib/tasks/${name}`)
  gulp.registry(new TaskRegistry(config))
  gulp.task(name)()
}

function getVestProjectConfig() {
  const projectConfigPath = path.resolve(config.cwd, 'project.config.json')
  if (!fs.existsSync(projectConfigPath) || !fs.existsSync(config.srcPath)) {
    console.error(`please make sure current working directory is a vest project.`)
    process.exit(1)
  }

  return require(projectConfigPath)
}

program.version(packageConfig.version, '-v --version')
  .usage('[command] [options]')

program.command('create <projectName>')
  .description('create a new vest project named <projectName> in current directory.')
  .action((projectName, cmd) => {
    runTask(cmd._name, Object.assign({}, config, {
      projectName,
      capitalProjectName: _.upperFirst(_.camelCase(projectName))
    }))
  })

program.command('build')
  .description('build the vest project in current working directory.')
  .option('-e, --env [env]', 'Build project in specified environment, default is [production]', 'production')
  .action((cmd) => {
    runTask(cmd._name, Object.assign({}, config, {
      env: cmd.env,
      projectName: getVestProjectConfig().projectname
    }))
  })

program.command('dev')
  .description('build the vest project in current working directory and then watch file changes for development.')
  .option('-e, --env [env]', 'Build project in specified environment, default is [development]', 'development')
  .action((cmd) => {
    runTask(cmd._name, Object.assign({}, config, {
      env: cmd.env,
      projectName: getVestProjectConfig().projectname
    }))
  })

program.command('*', { noHelp: true })
  .action(() => {
    program.help()
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.help()
}
