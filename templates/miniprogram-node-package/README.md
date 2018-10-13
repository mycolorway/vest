# <%= projectName %>
A wechat miniprogram node package project based on [vest](https://github.com/mycolorway/vest).

## Development

1. Install [vest](https://github.com/mycolorway/vest) globally first if it has not been installed yet:

```bash
npm i -g vest
```

2. Build project:

```bash
vest dev
```

3. Use wechat miniprogram dev tool open the `demo` directory.


## Unit Test

1. Write test code in `test/` directory,

2. Run tests with [Jest](https://jestjs.io/):

```bash
vest test
```

Or if you want to get coverage reports:

```bash
vest test --coverage
```
