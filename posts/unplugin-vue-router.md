---
title: 使用 unplugin-vue-router 记录 
date: 2024-03-07 18:00:00
---

# 使用 unplugin-vue-router 记录

最近将一个比较小的项目重构成使用 [unglugin-vue-router](https://github.com/posva/unplugin-vue-router) 的 file-based routing, 过程比较曲折，这里记录一下遇到的问题和解决方法。

## Procedures

首先按照文档 https://uvr.esm.is/introduction.html 一步步安装上插件，并修改对应的文件内容。注意现在最新版本的 unplugin-vue-router 要依赖 `vue-router@4.3.0` 以上版本，所以要先升级一下 `vue-router`.

### AutoImport

配置了 `auto-import` 的话，也可以 auto import `createRouter` 和 `createWebHistory`, 默认是不包括的，自己搞一下。 

```ts
AutoImports({
  plugins: [
    VueRouterAutoImports,
    {
      'vue-router/auto': ['createWebHistory', 'createRouter'],
    },
  ],
})
```

### 修改路由

按文档的要求，将文件名和目录结构按要求新建即可。

需要重定向的话，直接在 SFC 中写一个 `definePage` 加上 `redirect` 参数。

```vue
<script setup lang="ts">
definePage({
  redirect: '/some-path',
})
</script>

<template>
  <div />
</template>
```

::: warning 奇怪的编译错误
没写 `template` 的话，在 `vite build` 的时候会报一个 `At least one <template> or <script> is required in a single file component.` 的错，有点离谱，所以我暂时先补上一个没用的 `<template>`.
:::

### 修改 tsconfig.json

`tsconfig.json` 的 `moduleResolution` 参数**一定一定**要设置成 `Bundle`, 不能看漏这个步骤。否则 `vue-router/auto` 将无法从 `vue-router` 的 `package.json` 的 `exports` 中正确解析出对应的 TypeScript 类型。

参考：

- [TypeScript: TSConfig Reference - Docs on every TSConfig option](https://www.typescriptlang.org/tsconfig#moduleResolution)
- [Cannot find module 'vue-router/auto' or its corresponding type declarations](https://github.com/posva/unplugin-vue-router/issues/323#issuecomment-1963767533)
- [feat: allow auto types · vuejs/router@2d1dd2a](https://github.com/vuejs/router/commit/2d1dd2ad721d7e62d801d6788ba056444aa09bad)

### 删掉 router.ts <Badge type="danger" text="注意" />

这个应该是这次重构最坑的地方了，按上文全部配置完以后，部分路由可以打开但在一些情况下，就会报 `isFunction is not a function` 的错误，然后就再也打不开任何一个路由页面了。只有将 `node_modules/.vite` 的缓存删掉重新 restart 才能再一次进去 work 的路由。

一开始我以为是 `moduleResolution: Bundler` 的问题，网上查了很久都查不到相关的情况，直到看到 ionic 的这个 issue:

[bug: ionic vue and other component break the vite dev server · Issue #24800 · ionic-team/ionic-framework](https://github.com/ionic-team/ionic-framework/issues/24800)

这个报错简直就是一模一样，都是在 `RouterLink` 注册的时候报的错，好家伙原来是因为 `router.ts` 这个文件的 export 导致了引入了两次 Vue instances, 试试将 `router.ts` 删掉，所有 router 的创建代码直接搬到 `main.ts` 中，问题就解决了。

### 修改业务代码

修改具体业务关于路由使用的代码，包括

1. `useRoute` 要增加参数，使 `route` 可以做类型推荐，见参考资料[1]

```ts
const route = useRoute() // [!code --]
const route = useRoute('/some-path') // [!code ++]
```

2. 所有依赖 `route.name` 来做判断、跳转要切换成 `route.path`, 毕竟现在已经没有 route name 了

重新跑一下 `vue-tsc` 由于增加了 ts route 类型的检测，因此如果没改对，应该会报不少路由相关的错误，逐个改过来就好了。

参考：

- [route.params[param] incorrectly shows param does not exist](https://github.com/posva/unplugin-vue-router/discussions/176)


## Why unplugin-vue-router

`unplugin-vue-router` 和 `unplugin-auto-import`, `unplugin-auto-components` 一样，通过工具链尽可能地减少模板代码数量、减低重构的成本。

其实在我遇到的项目中，`router.ts` 文件都会存在大量的模板代码，定义每个页面的 `name`, `path`, `component` 等，也有不少项目会选择抽取各种各样的 `utils` 函数来辅助定义这些路由。

比如这些

```ts twoslash
// 更换路由组件的 name 属性，与路由组件的 name 属性保持一致
export function registerComponent<T extends { default: { name: string } }>(name: string, component: () => Promise<T>) {
  return () => {
    return component().then((res: T) => {
      res.default.name = name
      return res
    })
  }
}
```

和这些

```ts
function changePathMatch(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
  return routes.reduce((arr, cur) => {
    const temp = cloneDeep(cur)
    if (cur.children)
      temp.children = changePathMatch(cur.children)
    if (cur.pathMatch)
      temp.path = cur.pathMatch
    arr.push(temp)
    return arr
  }, [] as AppRouteRecordRaw[])
}
```

实际上，这些代码带来的价值和复杂度是不成正比的，很多时候我们还要花心思去考虑一个路由的 `path` 和 `name` 分别应该是什么，要不要一样？路由组件应该是 `Jobs.vue` 还是 `jobs/index.vue`? 这些问题就会让人产生比较大的心智负担了，干脆所见即所得好了，方便又快速。

::: tip 有点意思
其实这里有个挺有意思的问题，业务代码的路由跳转和判断应该依赖 `route.name` 还是 `route.path` 呢？
:::

比如我们需要移动一下部分代码的归属，做一下模块的划分。在以往这种重构是很巨大的工作，即使有 IDE 的协助也不能完全保证所有 import 目录被修改，另外也会影响到所有引用上游的 git 提交记录。但从构建工具上做这件事，基本上这类重构只涉及对应文件的移动，从理论上就不存在出现问题的可能了。

btw，我以前也是一个古老的 static import, 静态分析的派别，哎人嘛，还是会变的，真香。
