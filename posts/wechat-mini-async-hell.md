---
title: 小程序 Page 获取登录态，异步满天飞？
date: 2017-11-09 11:08:18
tags: [前端]
---

最近在开发微信小程序，在处理登录逻辑和后续业务页面的关系时，遇到了异步太多太乱的问题，本文来做个关于小程序登录态异步的总结。

<!-- more -->

## 登录逻辑与登录态

根据小程序文档与官方 Demo 的例子，微信登录逻辑在 `app.js` 的 `App.onLaunch` 中实现。另外还需要自行与第三方服务器独立进行一套授权机制，这里我使用了 JWT，在换取 `openid` 的接口中返回。

整个 `app.js` 的登录逻辑大致如下，进入小程序后检查微信登录态是否过期，过期了重新调起微信登录并换取新的 JWT 作为与第三方服务器通信的凭证；未过期则从 `localStorage` 中拉取 token 与用户信息。

```javascript
App({
  onLaunch: function () {
    const that = this;

    // 检查用户登录态是否过期，过期了重新登录
    wx.checkSession({
      success: () => {
        //session 未过期，并且在本生命周期一直有效
        that.globalData.token = wx.getStorageSync('token');
        that.globalData.userInfo = wx.getStorageSync('userInfo');
      },
      fail: () => {
        that.initLoginState();
      }
    });
  },
  globalData: {
    token: '',
    userInfo: null
  },
  // 重新登录
  initLoginState: function () {
    const that = this;

    // 登录
    wx.login({
      success: res => {
        // 调用获取用户信息接口
        wx.getUserInfo({
          success: fullUserInfo => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: `${host}/api/auth/loginwx`,
              method: 'POST',
              data: {
                code: res.code,
                userInfo: fullUserInfo
              },
              success: ({data}) => {
                wx.setStorageSync('token', data.data.token);
                wx.setStorageSync('userInfo', data.data.userInfo);
                that.globalData.token = data.data.token;
                that.globalData.userInfo = data.data.userInfo;
              }
            });
          }
        });
      }
    });
  }
});
```

## 业务页面获取数据

在 Page 中，不可避免地需要调用第三方服务器的接口获取数据，此时需要使用 JWT 进行授权。当进入页面时就需要拉数据时，请求放在了 `Page.onLoad` 方法中。

```javascript
const app = getApp();
const host = require('../../config').host;

Page({
  data: {
    groups: []
  },
  onLoad: function () {
    this.listGroups();
  },
  // 获取订单团信息
  listGroups: function () {
    wx.request({
      url: `${host}/api/group/list`,
      header: {
        'authorization': app.globalData.token
      },
      success: ({data}) => {
        this.setData({
          groups: data.data
        })
      }
    });
  }
})
```

测试时却发现有时候页面有数据，有时候页面无数据。进一步查看请求便发现有时 `token` 有值，有时 `token` 拿不到值。

## 全特么是异步

仔细想想就能够明白，原因在于 `App.globalData.token` 的设置是**异步**，虽然 `App.onLaunch` 与 `Page.onLoad` 有明确的时序性（文档上没有说明，通过测试可发现 `Page.onLoad` 总在 `App.onLaunch` 后执行），但「设置 token」与「请求业务接口」两个步骤不能**保证**其时序性，因此会出现偶尔请求失败的情况。

既然无法保证时序，第一个想法就是 EventBus 了，这种很 free 的东西，用起来功能强大但也很危险。

给 `App` 添加了一个自己实现的简单全局 `EventBus` ，并在 `checkSession.success` 和重新登录设置好 `token` 后都广播一个登陆成功事件。这时候 Page 就变成这样了。

```javascript
loggingSubs: null,
onLoad: function () {
  if (app.globalData.token) {
    this.listGroups();
  } else {
    this.loggingSubs = app.eventBus.on('LOGGING-SUCCESS', this.listGroups.bind(this));
  }
},
onUnload: function () {
  this.loggingSubs.off();
},
```

由于不能保证时序性，如果在 `onLoad` 方法**只**订阅事件就会出现：

- 登录成功了，广播登陆成功事件（没有人订阅，消息被丢弃）
- 执行 `Page.onLoad` 方法，订阅事件

结果没有调用业务接口，因此需要处理两种情况。

> 其实 RxJS 提供了 `ReplaySubject` 这样的 `Observable` 来使后订阅的观察者也能收到之前的所有通知，自行实现一个 `ReplaySubject` 就能去掉这种判断，详见[实现一个超简单的 ReplaySubject](https://blog.imtouch.info/2017/11/09/implement-a-replay-subject/)

## 每个页面都要这样？

如果每个业务 Page 都需要在初始化时调用业务接口，都需要写一套这样的逻辑？有没有什么更好的解决办法？

更甚之，就算是一些事件绑定，理论上也不能保证事件调用时已经完成登录，难道每次调用业务接口都要写一套这样的判断？

这个问题的出现根本在于登录态的获取、token 的设置是异步的，而这个异步与业务接口调用需要同步（必须先有 token 才能调用），能否把这个过程通过小程序框架固定成同步？如 `Page.onLoad` 方法的调用必须在 App 的某个钩子之后？

如果有更好的解决方法，请不吝赐教，谢谢。
