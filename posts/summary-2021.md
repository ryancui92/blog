---
title: 2021 年终总结
date: 2022-01-27 17:13:21
tags: [年终总结]
---

一年过去得飞快，记得上一次写年终总结还是 2018 年的时候。2019 和 2020 两年都没写（懒了，今年就特别地重新写一下总结吧。

<!-- more -->

## 工作

今年的 commit 还是有点惨淡，基本没有什么提交代码到 git 的机会，主要工作都是围绕低代码进行开发，是一些 script 和常规的 Vue 组件开发。

还是因为做得不够好，一些很常见的软件工程的迭代发布工具与流程其实都没有完备，因此一年下来的很多项目都挺让人难受的。

### Low Code 与 DSL

最近一年看了很多业界的低代码建设和方案，国内各个大厂的普遍方案都是 DSL，无论是高层的 JSON-based DSL 或者底层的 VDOM-based/AST-based DSL，不同的路会有很多不同的考量，诸如扩展性，实现难度等。但其实本质都是为了将复杂度封装起来，完成复用，提高效率。

另外，业界的一个共识是，低代码平台的使用者是研发。系统的总复杂度（overall complexity）和构建系统所需的知识准备并没有因为低代码而下降，低代码带来的提升只有效能，更快更精确地完成重复的、可收敛的业务。因此很多低代码平台会顺便把代码生成做了，或者将 DSL 放在 code implemented 的上层（洋总提到 DSL 其实是语法糖），DSL 这一层主要 focus 在效能，扩展性还是回到 code 那一层上。

最后个人比较感叹的一点是，要做好 DSL 的 runtime 实在是太难了。

### 微前端

微前端大概是前几年火起来的，在我看来微前端的一个最大的优点是可以快速整合各种不同技术栈的陈年老项目，并且可以小步迭代完成技术栈的升级，而不用完全推倒重做。在决定是否使用微前端的时候，还是要仔细考虑一下，引入的 cost 是否有足够的 benefit，有没有足够的性价比。

## 生活

年初进行了一波轰轰烈烈的牙齿健康护理运动，相继完成了洗牙、牙周治疗、拔智齿、补牙等一系列操作，花了大几万的样子。那段时间基本每天都生活在牙痛的恐惧之中，每周都要去医院报道，不过全部搞定之后还是有明显的变化，以前每次刷牙都因为严重的牙周病而出血，现在完全没有流血的烦恼了。

其实最重要的是现在学会了要好好爱护牙齿，每天饭后要用牙线，晚上要好好刷牙，养成这样的习惯还是很关键的，毕竟现在看牙是真的贵，有问题还是尽早治疗比较好，不能拖。

另一件比较大的事情是，九月份从淘金搬到了大沙地，老黄埔，说实话我不太喜欢广州东边的生活气息和生活节奏，因此在住这件事情上也不太顺心。

最后就是今年基本没存到什么钱啊！各种买买买，买了太多东西了，两台 MBP、iMac、iPad Pro、iPhone 13、HomePod、PS5...未来两年都在还钱给苹果了。

Herman Miller 还是有点好坐的，现在已经变成了主力椅，以后有钱再买个冈村吧。

## 旅游

由于疫情基本都没怎么出外旅游了，今年印象中就去了两个地方：汕头和上海。

国庆汕头游就是 Chris 和 Champagne 的毕业游啦，跟上一次去汕头感觉并没有太大差别，就是这次终于去成了南澳岛（代价是要五点起床）。这次的最大惊喜必须是创弟牛肉，实在是太好吃了，好吃到去了两次。

然后休息了两天就接着出发去上海，主要目的地迪士尼！真心感受到年纪大了之后，对激烈的机动游戏真的失去了兴趣（变得怕死），还是普通的坐车车更适合我了。

比较可惜的是两日票都在天气都不好，又冷又下雨，穿着雨衣还是很大的不方便。

## 2022 目标

定一下 2022 小目标，年底来逐项核对！

- 至少读 12 本书
- 存一下钱，不少于 10w 吧
- 坚持每周跑步/运动
- 坚持写博客/文章，至少 10 篇
- 今年搬家一定要搬回一号线沿线了，要住在市中心
- 入手一个日常用的双肩包
