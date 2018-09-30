const path = require('path')
const minimist = require('minimist')
const cwd = process.cwd()

const options = minimist(process.argv.slice(2), {
  string: ['env'],
  default: {
    env: process.env.NODE_ENV || 'development'
  }
})

module.exports = Object.assign({}, options, {
  cwd,
  srcPath: path.resolve(cwd, 'src'),
  distPath: path.resolve(cwd, 'dist'),
  basePath: path.resolve(__dirname, '../')
})
