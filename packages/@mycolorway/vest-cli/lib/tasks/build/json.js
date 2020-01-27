const jeditor = require("gulp-json-editor");
const { template, resolveProjectPath, resolveNodePath, isNodeModulePath, isNodeModuleRootPath } = require('../utils')
const gulpPlumber = require('gulp-plumber')

module.exports = function (gulp) {
  gulp.task(`${this.config.name}:json`, () => {
    this.log(`start compiling json files...`)
    return gulp.src(this.jsonGlobs, { base: this.config.srcPath })
      .pipe(gulpPlumber())
      .pipe(jeditor((json) => {
        const { usingComponents } = json;
        if (usingComponents) {
          json.usingComponents = Object.keys(json.usingComponents).reduce((result, key) => {
            const componentPath = usingComponents[key];
            if (isNodeModulePath(componentPath)) {
              result[key] = `@@/${isNodeModuleRootPath(componentPath) ? `${componentPath}/index` : componentPath}`
            } else {
              result[key] = componentPath;
            }

            return result;
          }, {});
        }
        return json;
      }))
      .pipe(template(this.config))
      .pipe(resolveProjectPath())
      .pipe(resolveNodePath(this.config))
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish compiling json files.`))
  })
}
