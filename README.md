# todo

一个简易的 todo 项目，包含后端和前端

线上示例：<https://todo.hal.wang>

一键部署：
[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhal-wang%2Ftodo&branch=main)

## 介绍

使用了数据库两个文档：`user`, `todo`。

测试账号：

- email: `test@hal.wang`
- password: `123456`

前端：vue3 + pinia + ant-design

后端：[ipare](https://ipare.org)

全部使用 ts 开发

### 权限认证

使用 JWT 进行了基本的权限认证

使用 Cookie 技术进行 Token 管理和验证

后端写了以下几种权限

- 管理员: 用 @Admin 装饰的 Action
- 开放: 用 @Open 装饰的 Action
- 普通用户：默认，需要登录状态

## 二次开发

如果现有功能不能满足，你可以进行二次开发

### API

在 `todo-api` 下创建文件 `.env.local`，内容如下

```
SCF_NAMESPACE=cloudbase环境id
SECRET_KEY=腾讯云 secret key
SECRET_ID=腾讯云 secret id
JWT_SECRET=JWT 密钥
```

#### 运行 API

先安装依赖，在 `todo-api` 下执行

```bash
yarn install
```

再使用 vscode 打开 `todo-api`，直接 F5 开始调试

或在 `todo-api` 目录下执行

```bash
yarn dev
```

### Web

先安装依赖，在 `todo-web` 下执行

```bash
yarn install
```

再执行下面命令运行

```bash
yarn dev:test
```

或使用已发布的接口，需要修改 `todo-web/.env.development` 文件中的 `VUE_APP_BASE_API`

然后运行

```bash
yarn dev
```

### 发布

可以本地使用 `@cloudbase/cli` 发布，也可以使用 GitHub Actions 持续集成

#### cli 发布

在项目根目录下创建 `.env.local` （注意是项目根目录，不是 API 或 Web 下）

内容如下

```
ENV_ID=cloudbase环境id
JWT_SECRET=JWT 密钥
```

在项目根目录下运行以下命令发布

```bash
yarn deploy
```

#### GitHub Actions

仓库增加 Secrets，在 `Settings -> Secrets -> Actions`，点击 `New repository secret` 按钮

- TENCENT_SECRET_ID: 腾讯云 secret id
- TENCENT_SECRET_KEY: 腾讯云 secret key
- ENV: 与 `cli 发布` 的 `.env.local` 文件内容相同

配置完成后，每次 main 分支提交代码就会自动发布到 CloudBase

发布进度可在仓库 `Actions` 中看到
