const path = require('path');

module.exports = function(gulp) {
  gulp.task(`${this.config.name}:copyOtherFiles`, () => {
    this.log(`start coping other files...`)
    return gulp.src(this.copyGlobs, {
      base: this.config.srcPath,
      dot: true
    }).pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish coping other files.`))
  })

  gulp.task(`${this.config.name}:copyProjectConfig`, () => {
    this.log(`start coping project config files...`)
    return gulp.src([
      path.resolve(this.config.cwd, 'project.config.json'),
    ], {
      base: this.config.cwd,
      dot: true
    }).pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish coping project config files.`))
  })

  const copyTasks = [`${this.config.name}:copyOtherFiles`]
  if (this.config.platform === 'feishu' && this.config.projectType === 'miniprogram') {
    copyTasks.push(`${this.config.name}:copyProjectConfig`);
  }

  gulp.task(`${this.config.name}:copy`, gulp.parallel(copyTasks));
}
