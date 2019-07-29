# <%= projectName %>
A wechat miniprogram project based on [vest](https://github.com/mycolorway/vest).

## Development

1. Install [vest-cli](https://github.com/mycolorway/vest/packages/@mycolorway/vest-cli) globally first if it has not been installed yet:

```bash
npm i -g @mycolorway/vest-cli
```

2. Build project:

```bash
vest dev
```

Or build in production env with `.env.production` created:

```bash
vest build
```

3. Use wechat miniprogram dev tool open the project root.


## Unit Test

1. Write test code in `test/` directory,

2. Run tests with [Jest](https://jestjs.io/):

```bash
vue test
```

Or if you want to get coverage reports:

```bash
vue test --coverage
```
