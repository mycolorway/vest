const _ = require('lodash')
const BaseCommand = require('./base')

class CreateCommand extends BaseCommand {

  constructor() {
    super()

    const projectName = this.config._[1]
    if (!projectName) {
      console.log(`project name is required for create command, e.g. vest create new_project`)
      process.exit(1)
    }

    Object.assign(this.config, {
      projectName: projectName,
      capitalProjectName: _.upperFirst(_.camelCase(projectName))
    })
  }

  get taskName() {
    return 'create'
  }

}

module.exports = CreateCommand
