const path = require('path');
const cwd = process.cwd();
const packageConfig = require('../package.json');

module.exports = {
  cwd,
  basePath: path.resolve(__dirname, '../'),
  version: packageConfig.version,
};
