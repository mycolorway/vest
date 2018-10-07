const fs = require('fs')
const path = require('path')
const BaseCommand = require('./base')

class DevCommand extends BaseCommand {

  constructor() {
    super()
    this.validateWorkingDirectory()
  }

  get taskName() {
    return 'dev'
  }

  validateWorkingDirectory() {
    const projectConfigPath = path.resolve(this.config.cwd, 'project.config.json')
    if (!fs.existsSync(projectConfigPath) || !fs.existsSync(this.config.srcPath)) {
      console.log(`please make sure current working directory is a vest project.`)
      process.exit(1)
    }

    const projectConfig = require(projectConfigPath)
    Object.assign(this.config, {
      projectName: projectConfig.projectname
    })
  }
}

module.exports = DevCommand
