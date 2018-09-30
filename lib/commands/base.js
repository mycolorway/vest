const path = require('path')
const gulp = require('gulp')
const config = require('../config')

class BaseCommand {

  constructor() {
    this.config = Object.assign({}, config)
  }

  get taskName() {
    return ''
  }

  run() {
    if (this.taskName) {
      const TaskRegistry = require(`../tasks/${this.taskName}`)
      gulp.registry(new TaskRegistry(this.config))
      gulp.task(this.taskName)()
    }
  }

}

module.exports = BaseCommand
