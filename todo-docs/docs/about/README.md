---
title: todo
---

# todo

## web

<https://todo.hal.wang>

## docs

[https://todo.hal.wang/docs](/docs)

## api

the API documents are generated automatically by `@sfajs/swagger`

[swagger api](https://todo-5gcg801923564f08-1253337886.ap-shanghai.service.tcloudbase.com/v2)

## 一键部署

[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhal-wang%2Ftodo&branch=main)

## 简介

API 使用了 `@sfajs/router` 符合 `RESTFul` 规范的 API 格式，并且设置 `router.static = true;`。

使用了数据库两个文档：`user`, `todo`。

测试账号：

- email: `test@hal.wang`
- password: `123456`。

## Fork

你也可以 Fork 本项目后，修改示例项目中的 `.env` 文件中的 `ENV_ID`，值为你的 cloudbase 环境 id 如 `your_name-***`

在示例项目目录下（`demo/todo`），执行以下语句发布 `npm run deploy`

## build 生成的内容

API 编译后会在云函数目录 `functions` 生成文件夹 `v2` (v2 版本)，

在 `v2` 文件夹中包含以下内容：

- controllers：`@sfajs/router` 默认路由文件夹
- lib：除 `controllers` 外的其他帮助类
- models: ts model
- index.js：入口函数

web 编译后会生成 `todo-web/dist` 目录，发布的 web 是此文件夹中的内容

docs 编译后生成 `todo-web/public/docs` 目录，发布 web 时会自动编译并一起发布

## 权限认证

### 身份

示例写了 `hl`、`ql`、`admin` 三个身份

#### hl

即 `header login`，通过 `header` 的 `account` 和 `password` 验证登录

#### ql

即 `query login`, 通过 `query` 的 `account` 和 `header` 的 `password` 验证登录

#### admin

验证 `header`或 `query` 中的 `account` 是否管理员

### 实际业务

在实际业务中，`password` 可能会加密，或者使用 `token` 方式等，验证方法与 `demo` 类似
