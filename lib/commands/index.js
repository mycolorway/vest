const fs = require('fs')
const path = require('path')

module.exports.findCommand = function(name) {
  const commandPath = path.resolve(__dirname, `${name}.js`)
  if (fs.existsSync(commandPath)) {
    return require(commandPath)
  } else {
    return require('./help')
  }
}
