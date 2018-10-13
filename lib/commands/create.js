const program = require('commander')
const inquirer = require('inquirer')
const _ = require('lodash')
const {runTask} = require('./utils')
const config = require('../config')

program.command('create <projectName>')
  .description('create a new vest project named <projectName> in current directory.')
  .action(async (projectName, cmd) => {
    const answers = await inquirer.prompt([{
      type: 'list',
      name: 'projectType',
      message: 'Select type of the new vest project:',
      choices: ['miniprogram', 'miniprogram-node-package'],
      default: 'miniprogram'
    }, {
      type: 'confirm',
      name: 'useESLint',
      message: 'Do you want to use ESLint for js linting?',
      default: true
    }])
    runTask(Object.assign({}, config, answers, {
      name: 'create',
      projectName,
      capitalProjectName: _.upperFirst(_.camelCase(projectName))
    }))
  })
