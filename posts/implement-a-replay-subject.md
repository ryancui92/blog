---
title: 实现一个超简单的 ReplaySubject
date: 2017-11-09 10:55:40
tags: [技术]
---

## 需要一个 EventBus

在前一篇文章中提到，通过 EventBus 可以使登录逻辑与业务接口同步起来，当然这也是小程序页面间通信的一种方式，因此需要一个 EventBus.

<!-- more -->

无非就是自己造轮子或者直接用别人的，由于一直在写 Angular，因此第一想法就是能不能把 RxJS 扔进去，那 `Observable`/`ReplaySubject` 不就随便用了吗。但其实需要用到的功能没这么多，其实就是一个简单的 `publish/subscribe` 就完了，于是就决定自己写一个（Google 抄一个）吧。

## 需要怎样的 EventBus

于是找到了[微信小程序跨页面通信解决思路](https://aotu.io/notes/2017/01/19/wxapp-event/index.html)，里面有一个简单的实现，抄过来后我发现有几个问题可以改进：

- 不需要处理 `args`，需要传什么数据麻烦你自行包成一个 `Object`，只给你传 `payload` 谢谢
- 销毁订阅还要把这个回调函数也传进去也太不科学了，RxJS 不是都是返回一个值，调一下 `.unsubscribe()` 就可以了吗
- 无法实现 Replay，必须先订阅再广播，不满足需求啊

那就改一改吧。

## 总体思路

思路非常相似，用一个 `stores` 把所有事件的回调存起来，暴露 `on` 用于订阅事件，`emit` 用于广播。跟原来的设计有变化的有：

- 新建一个 `Subscription` 类，用于 `on()` 的返回值，以后我们可以调用 `Subscription.off()` 来直接销毁订阅
- 不再处理更多的广播数据，只处理 `payload`
- 使用 `cache` 来缓存所有 emit 过的值，并在新订阅者到来时重放这些值

### Subscription

销毁订阅的实质是去 `stores` 里把对应的事件回调函数删掉就可以了，文章原来的方法之所以要传入回调就是去定位这个函数，后来改成了把 Page Context 传进去了。

为了定位可以简单直接一点啊，用一个自增 id 来定位就好了。因此需要一个 ID 生成器，一个简单闭包：

```javascript
this.getAutoIncrese = (function() {
  let seq = 1;
  return function () {
    ++seq;
  };
})();
```

定位解决了，下一步就是删掉，只需要拿到这个 `stores` 变量就 ok 了。那就在 `Subscription` 里保留一份 `EventBus` 的实例就好了。

```javascript
class Subscription {
  eventBus;
  eventName;
  cbId;

  constructor(eventBus, eventName, cbId) {
    this.eventBus = eventBus;
    this.eventName = eventName;
    this.cbId = cbId;
  }

  // 销毁订阅事件
  off() {
    this.eventBus.off(this.eventName, this.cbId);
  }
}
```

整个 `Subscripton` 就基本完成了，这里的 `off()` 是直接调用 `EventBus` 的方法销毁。在 `EventBus` 的 on 方法中返回一个 `Subscription` 示例。

```javascript
return new Subscription(this, eventName, cbId);
```

### 只处理 payload

当然能够允许多个参数的确更方便，但有时候约定带来的简化是明显的。

```javascript
emit(eventName, payload) {
  const eventArray = this.stores[eventName];
  if (eventArray) {
    eventArray.forEach(e => {
      e.fn.apply(null, payload);
    });
  }
}
```

不用关心 `arguments` 究竟是不是一个数据，调用 `Array.from` 还是 `Array.prototype.slice` 好，这些细节会让人抓狂。

### 加入 Replay

重放的逻辑也很简单，emit 的时候存起来，判断一下有没有超长，超长去掉最旧那个；on 的时候把存起来的值在新的回调上重放。

```javascript
// define cache and cacheMax
constructor(cacheMax) {
  this.cache = {};
  this.cacheMax = cacheMax || 1;
}

// on segment: replay the emit value on new fn
if (this.cache[eventName]) {
  this.cache[eventName].forEach(payload => {
    fn.apply(null, payload);
  });
}

// emit segment: reserve the emit value
if (!this.cache[eventName]) {
  this.cache[eventName] = [];
}
if (this.cache[eventName].length === this.cacheMax) {
  this.cache[eventName].shift();
}
this.cache[eventName].push(payload);
```

这样一个超简单的 `ReplaySubject` 就搞定了。

