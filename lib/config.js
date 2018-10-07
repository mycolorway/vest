const path = require('path')
const cwd = process.cwd()

module.exports = {
  cwd,
  srcPath: path.resolve(cwd, 'src'),
  distPath: path.resolve(cwd, 'dist'),
  basePath: path.resolve(__dirname, '../')
}
