---
title: 使用 mpvue 开发微信小程序记录
date: 2018-04-26 11:16:35
tags: [小程序, 前端]
---

本文记录了使用 mpvue 开发微信小程序时遇到的一些问题及解决方法。

<!-- more -->

## 获取页面路由参数

官方文档写得很清楚，引用一下。

> **1. 如何获取小程序在 page onLoad 时候传递的 options**
>
> 在所有 页面 的组件内可以通过 `this.$root.$mp.query` 进行获取。
>
> **2. 如何获取小程序在 app onLaunch/onShow 时候传递的 options**
>
> 在所有的组件内可以通过 `this.$root.$mp.appOptions` 进行获取。

## Page 背景色

一开始以为在 Vue 组件里把根元素的背景色和 Page 的 option 设置好就可以了，比如这样

```html
<template>
  <div class="container">
  </div>
</template>

<style>
  .container {
    background-color: #EEEEEE;
  }
</style>
```

 ```javascript
// main.js
import Vue from 'vue';
import MyPage from './my_page';

const app = new Vue(MyPage);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '某个页面',
    backgroundColor: '#EEEEEE'
  },
};

 ```

这样只有 `.container` 所在的 div 是有背景色的，如果 `.container` 没有被撑开到一个页面这么大，page 的背景色还是白的，因此需要全局设置 page 的背景色

```css
page {
  background-color: #F4F5F5;
}
```

## template 不支持函数

mpvue 的文档中提到：

> 不支持在 template 内使用 methods 中的函数。

那就会带来很大的不方便，比如有的时候需要在一个 v-for 里根据某些条件来显示或隐藏某个 dom

```html
<div class="option" v-for="(option, index) in options">
  <span>{{option.name}}</span>
  <span v-if="selectedOptionIds.includes(option.id)">
    <img src="/static/img/tick.png" alt="">
  </span>
</div>
```

这里的 `selectedOptionIds` 是一个 id 数组，如果当前项被选中了就显示一个打钩的图片，虽然没有使用 methods 里的函数，但这里这样写依然是不行的（不知道是 mpvue 的 bug 还是的确不支持）。

当我的 `seletedOptionIds` 是一个单元素数组的时候，直接把 v-if 改成 `selectedOptionIds == option.id`，效果就出来了，看来的确是用了一个函数的问题。

可以通过再新建一个变量来解决，这种动态判断说到底其实也是可以在初始化的时候把判断的 flag 值先算好，然后再 template 里通过 flag 判断。

```html
<template>
  <div class="option" v-for="(option, index) in options">
    <span>{{option.name}}</span>
    <span v-if="flags[index]">
      <img src="/static/img/tick.png" alt="">
    </span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [],
        selectedOptionIds: [],
        flags: []
      };
    },
    onShow() {
      // 初始化 options/seletedOptionIds ...

      // 初始化 flags
      this.flags = this.options
        .map(option => option.id)
        .map(id => this.selectedOptionIds.includes(id));
    }
  }
</script>
```

## v-if/v-show

由于 v-if 会实际地创建和销毁对应的 DOM，而 v-show 总是创建节点，有些时候会导致一些样式上的问题，特别是在 DOM 节点上有动态的样式绑定时。

在性能方便需求不高时，可按需使用 v-if 或 v-show。

## px/rpx

mpvue-loader 中用到了 [px2rpx-loader](http://mpvue.com/build/px2rpx-loader/) 会自动把 style 里的 px 单位自动转成小程序的 rpx 单位，有些使用我们并不希望使用相对的 rpx 单位，目前还没有找到什么切实的解决方法。

另外，[px2rpxLoader插件](https://github.com/Meituan-Dianping/mpvue/issues/220)这里提到的改变 loader 顺序的方法并没有什么用，会报错。全部转换的影响也不会很大。

## 允许页面分享

mpvue 默认对所有页面都开了分享，如果不想当前 Page 出现分享菜单，可以参考[如何在vue中设置去掉转发功能](https://github.com/Meituan-Dianping/mpvue/issues/206)里的做法。

```javascript
// FIXME mpvue 对所有页面默认开了分享，不分享的 workaround
onShareAppMessage() {
  return {};
},
onLoad() {
  wx.hideShareMenu();
},
```

*新版本 mpvue 已经取消了对所有页面开启分享，只有定义了 `onShareAppMessage` 方法才会开启分享*

## TimePicker 国际化

小程序提供了一个 mode=time 的时间 picker，一般来说不会导致什么很大的问题。但由于这个 picker 直接调的是系统的时间选择，在 iOS 下如果用户的语言选了日语，这时 picker 拿到的 value 就不再是 `HH:mm` 这种格式了，而是像 `'14午後2:30'` 这样的字符串，构造出来的 Date 字符串后端解析不了便报错了。

解决办法是直接使用 mode=multiSelector 的多列 picker 替换掉时间选择器，自定义 hour 和 minute 列（0~23, 0~59），不再依赖系统语言的时间。

```html
<picker class="time-picker" mode="multiSelector"
        :range="timeRange"
        :value="vote.deadlineTime"
        @change="onTimeChange">
  <div class="time-value">
    {{vote.deadlineTime[0] + ':' + vote.deadlineTime[1]}}
  </div>
</picker>
```
