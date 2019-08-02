# vest 的命令行工具

### 安装

```
npm i @mycolorway/vest-cli -g
```

### 支持的命令

#### vest create

从模版创建小程序项目

#### vest dev

使用 `.env.development` 里的环境变量预编译小程序，并且在源文件修改之后自动重新编译

#### vest build

使用 `.env.production` 里的环境变量预编译小程序，可以增加 `-w` 参数监听源文件变化

#### vest test

基于 Jest 运行 test 文件夹里的测试用例，可以增加 `--coverage` 参数来生成测试覆盖率报告

