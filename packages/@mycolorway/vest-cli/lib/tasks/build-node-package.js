const BuildTasksRegistry = require('./build')

class BuildNodePackageTasksRegistry extends BuildTasksRegistry {

  get taskNames() {
    return ['template', 'babel', 'sass', 'json', 'copy']
  }

}

module.exports = BuildNodePackageTasksRegistry
