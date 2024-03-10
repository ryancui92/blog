---
title: Ionic 构建生产版本报错 Maximum call stack size
date: 2017-11-18 10:30:03
tags: [前端]
---

## Ionic 构建失败

使用 `ionic-app-scripts build` 构建一个应用的生产版本时，发现出现了以下的错误：

<!-- more -->

```
[18:21:18]  ionic-app-script task: "build"
[18:21:18]  Error: ./node_modules/sockjs-client/lib/main.js Module build failed: RangeError: Maximum call stack size
            exceeded at narrowTypeByInstanceof
            (/Users/ryancui/kit/zhangting-wx/node_modules/typescript/lib/typescript.js:36003:44) at
            narrowTypeByBinaryExpression
            (/Users/ryancui/kit/zhangting-wx/node_modules/typescript/lib/typescript.js:35911:32) at narrowType
            (/Users/ryancui/kit/zhangting-wx/node_modules/typescript/lib/typescript.js:36124:32) at narrowType
            (/Users/ryancui/kit/zhangting-wx/node_modules/typescript/lib/typescript.js:36122:32) at narrowType
            (/Users/ryancui/kit/zhangting-wx/node_modules/typescript/lib/typescript.js:36127:36) at
            getTypeAtFlowCondition (/Users/ryancui/kit/zhangting-wx/node_modules/typescript/lib/typescript.js:35723:36)
            at getTypeAtFlowNode (/Users/ryancui/kit/zhangting-wx/node_modules/typescript/lib/typescript.js:35604:32) at
            getFlowTypeOfReference (/Users/ryancui/kit/zhangting-wx/node_modules/typescript/lib/typescript.js:35560:51)
            at checkIdentifier (/Users/ryancui/kit/zhangting-wx/node_modules/typescript/lib/typescript.js:36313:28) at
            checkExpressionWorker (/Users/ryancui/kit/zhangting-wx/node_modules/typescript/lib/typescript.js:41277:28) @
            ./node_modules/sockjs-client/lib/entry.js 3:17-34 @
            ./src/pages/home/business-consultation/BusinessConsultationService.ts @ ./src/app/app.module.ngfactory.ts @
```

定位一下问题，发现是使用了 `sockjs-client` 的包导致的，注释掉下面一句的代码后，发现编译通过了！

```typescript
const sock = new SockJS(WEBSOCKET_URL + '/consulting?token=' + this.globalData.token);
```

另外，直接用 `npm run build` 打包并不会有什么问题，只有 `npm run build --prod` 才出现问题。由于使用了 `--prod` 打出的包体积比 `--dev` 会小很多，因此这个问题必须解决。

## 怎么办

遇事不决找 Google，一番查找找到了一个一毛一样的问题，可惜三个月了并没有人鸟他。

[ionic production build fails when using sockjs-client with “Maximum call stack size exceeded”](https://stackoverflow.com/questions/45463022/ionic-production-build-fails-when-using-sockjs-client-with-maximum-call-stack-s)

实在太惨了，看来这个问题有点复杂啊。

### 是谁的锅

先把锅分出去，涉及到这个 build 的有：

- Ionic Framework
- Webpack
- TypeScript
- sockjs-client

因此，首先在用 `angular-cli` 初始的项目里打包一下这个 `sockjs`，发现并没有问题，加上 build 日志中的 `ngc` 编译没有报错，报错出现在 `webpack started` 后，因此 `TypeScript` 和 `sockjs-client` 都应该是清白的。

那应该是 `ionic-app-scripts` 还有它依赖的 `webpack` 的问题了，去搜下 Issue，发现了这个：

[[3.0.0] JavaScript heap out of memory](https://github.com/ionic-team/ionic-app-scripts/issues/1247)

大意是把 `ionic-app-scripts` 从 2.1.4 升级到 3.1.2 后，使用 `--prod` 打包会出现 JavaScript 堆溢出。

现在我们遇到的问题是调用栈满了，为什么调用栈会满了呢？一般来说 `sockjs-client` 这种使用这么广泛的库应该不会是代码的 bug, 联想一下其实跟这个遇到的问题是类似的。

### 解决

Issue 说在 2.1.4 没问题，3.1.2 堆溢出了，但我们在用 2.1.4 啊，特么调用栈溢出了啊。Fine, Let's try 3.1.2

```
[11:57:08]  ionic-app-scripts 3.1.2
[11:57:08]  build prod started ...
[11:57:08]  clean started ...
[11:57:08]  clean finished in 2 ms
[11:57:08]  copy started ...
[11:57:08]  copy finished in 94 ms
[11:57:08]  deeplinks started ...
[11:57:08]  deeplinks finished in 21 ms
[11:57:08]  ngc started ...
[11:57:16]  ngc finished in 7.87 s
[11:57:16]  preprocess started ...
[11:57:16]  preprocess finished in 1 ms
[11:57:16]  webpack started ...
[11:58:08]  webpack finished in 52.80 s
[11:58:08]  uglify started ...
[11:58:08]  sass started ...
[11:58:10]  sass finished in 1.06 s
[11:58:10]  cleancss started ...
[11:58:11]  cleancss finished in 1.06 s
[11:58:29]  uglify finished in 20.64 s
[11:58:29]  postprocess started ...
[11:58:29]  postprocess finished in 51 ms
[11:58:29]  lint started ...
[11:58:29]  build prod finished in 81.53 s
[11:58:32]  lint finished in 2.48 s
```

可以了你敢信！

然而注意到 webpack 打包居然用了近一分钟，会不会这次只是侥幸成功呢？

多试几次应该是没有问题了。不过，3.1.2 的构建速度比 2.1.4 下降了不少，慢了快一倍。

| Compile Type/Version | v2.1.4 | v3.1.2 |
| -------------------- | :----- | ------ |
| JIT                  | ~8s    | ~15s   |
| AOT                  | ~50s   | ~80s   |
