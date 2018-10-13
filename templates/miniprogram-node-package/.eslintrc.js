module.exports = {
  'extends': [
    "eslint:recommended"
  ],
  'parserOptions': {
    'ecmaVersion': 9,
    'sourceType': 'module'
  },
  'env': {
    'es6': true,
    'node': true,
    'jest': true
  },
  'globals': {
    'window': true,
    'document': true,
    'App': true,
    'Page': true,
    'Component': true,
    'Behavior': true,
    'wx': true,
    'getCurrentPages': true,
  },
  'rules': {}
}
