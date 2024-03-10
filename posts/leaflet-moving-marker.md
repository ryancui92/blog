---
title: Leaflet MovingMarker 轨迹回放功能
date: 2018-03-12 11:42:33
tags: [前端]
---

最近有一个关于地图轨迹回放的功能，使用了 Leaflet 的 MovingMarker 插件后仍有不少问题需要解决，本文介绍了实现这个需求的过程与方案。

<!-- more -->

## 来自产品的需求

轨迹回放往大了讲其实有点像视频播放器，有一个可拖动的指示器，地图上就是一个移动的 marker.（这里有张 10M 的动图...）

<div style="display: flex; justify-content: center;"><img src="https://static.ryancui.com/images/ios-sample.gif" style="width: 40%;"></div>

有几点需要注意的：

- 播放过程中可以暂停，暂停后可以从当前位置继续播放
- 播放过程中可以拖动指示器，地图上的点也需要相应地出现在对应的位置，但动画会继续播放，就像拖动播放器的进度条一样
- 同上，暂停过程中也可以拖动指示器，但此时动画不再播放

## 方案1：直接动画

轨迹其实就是对一个 Marker 做一个动画，用作展示，目前 Leaflet 已经有对应的移动点插件 [MovingMarker](https://github.com/ewoken/Leaflet.MovingMarker)，使用上也非常简单，传入一堆点坐标和持续时间，调用一下 `start()` 方法就马上有动画出来了。官网上的例子：

```javascript
var myMovingMarker = L.Marker.movingMarker([[48.8567, 2.3508],[50.45, 30.523333]],[20000]).addTo(map);

myMovingMarker.start();
```

这样就能实现地图上的一个可以移动的点。

但我们不光需要地图上的坐标点能够运动，还需要底下的指示器能根据地图点的移动作出相应的变化，比如移动到第二个点的时候，指示器也要同时显示为第二个点。

第一个想法就是通过事件来解决，在动画的过程中监听「移动到某个点」的事件，改变一下指示器的当前值就 ok 了。然而很不幸的是，MovingMarker 没有提供这样的事件，实际上 API 上有这样的一个事件：

> `end`: fired when the marker stops

但这个事件是在整段动画结束后才触发的，只会触发一次。举个栗子，如果有一段五个点的轨迹播放，只有当动画播放到最后一个点的时候才会触发这个 `end` 事件，在中途路过三个点的时候，啥事都没发生。

## 方案2：分段动画

既然这个 `end` 事件会在动画结束时才触发，那马上想到的就是把整个轨迹的动画分解成每一段线段的动画，再按顺序播放就行了。在 `end` 事件触发的时候改一下指示器的 model 值，简直 nice，看了下还果真有这样的 API

> `moveTo(latlng, duration)`: stops current animation and make the marker move to `latlng` in `duration` ms.

那思路就很清晰了，初始化 marker 为第一个点，然后调用 `moveTo`，开始到下一个点的动画，然后监听 `end` 事件，在事件处理函数中继续调用 `moveTo` 到下一个点，直到最后。顺便在 `end` 事件中，改变一下指示器的当前状态。

```javascript
// 坐标点数组
const points = [];
// 当前所在点索引
const cur = 0;
// 指示器当前值
let indicator = 1;
const MOVE_TIME = 1000;

marker.setLatLng(points[cur]);
marker.moveTo(points[++cur], MOVE_TIME);

marker.on('end', () => {
  indicator = cur;
  if (cur < points.length - 1) {
    marker.moveTo(points[++cur], MOVE_TIME);
  }
});
```

逻辑上看没啥大问题，但实际出来的效果却是出现了丢帧的现象，中间有几段的动画不见了，点直接就跳过去了。经过一番摸索后，发现在 `end` 的事件处理中加上 `setTimeout` 后丢帧就解决了。

```javascript
marker.on('end', () => {
  setTimeout(() => {
    indicator = cur;
    if (cur < points.length - 1) {
      marker.moveTo(points[++cur], MOVE_TIME);
    }
  }, 0);
});
```

分别调用 `.start()` 和 `.moveTo` 的例子，在 `moveTo` 下勾选了 setTimeout 后，丢帧消失了

### 拖动指示器的困境

回顾需求，我们发现其实我们只是把播放（暂停可通过 `pause`/`resume` 很好地实现）搞定了，在继续思考另外的需求怎么实现的时候，遇到了一个困境。

描述这个困境前，我们先把前面 marker 移动与指示器联动的具体细节说清楚。前面提到，指示器的当前状态指示一个变量 `indicator`，我们简单地在每次动画结束时做一个赋值 `indicator = cur` 就能完成这种联动了。假设我们使用的 MVVM 框架是 Angular 的话，这个指示器的 HTML 应该是类似这样的

```html
<indicator [ngModel]="indicator"></indicator>
```

绑定一个变量到组件里，嗯。

好，现在我们要实现拖动指示器的时候，marker 也能有所变化，那自然而然，给这个组件绑定个 change 事件吧，事件处理里改一下 marker 就好了！

```html
<indicator [ngModel]="indicator" (ngModelChange)="onIndicatorChange()"></indicator>
```

在 Angular 里，`ngModel` 绑定的属性默认会有一个 `ngModelChange` 事件，在 model 改变的时候调用。写好所有逻辑后打开页面测试，连原来的连贯动画都出问题了！为啥呢！

**如何区分 model 的改变是因为拖动改变还是代码调用改变的呢？**

对于这个 indicator 组件来说，它只知道 indicator 是它的 model，只要 model 变化了就调用回调，因此它无法区分这个 model 的改变是什么引起的。无法区分就意味着这个需求实现不了啊。

## 方案3：声明式

### 换种思路

既然区分不了，那干脆就不区分了？仔细想想实现分段动画的方式，其实那是一种**命令式**的实现方式：

**到第一个点 => 动画移动到第二个点 => 动画移动到第三个点 => ...**

使用命令式的方式来组织代码，往往以后逻辑复杂的时候会非常难以维护，那能不能以一种**声明式**的思路来组织呢？整个应用的 model 其实只有一个，就是当前所在的点，也就是说，一个 `index`，这个轨迹移动的过程应该是

**`index = 0` => `index = 1` => `index = 2` => ...**

至于页面上的元素如何变化（marker 需要移动、指示器需要变化），应该由一个关系来描述，那么当 model 变化时，相应的页面元素也能自动更新了。

使用 JavaScript 的 getter/setter 能很好地做到

```javascript
_cur = 0;
get cur() {
  return this._cur;
}

set cur(value) {
  // 绑定对应的关系
  this._cur = value;
}
```

这样实现后，`end` 事件就变得非常简单了，就是一个简单的索引自增，注意 `setTimeout` 还是需要的

```javascript
marker.on('end', () => {
  setTimeout(() => {
    if (cur < points.length - 1) {
      cur++;
    }
  }, 0);
});
```

### model 的逻辑

在写里面的逻辑时，由于涉及到动画，那么当设置 `index` 的时候，会有两种动画策略：

1. 执行从点 index 到点 index+1 的动画
2. 执行从点 index -1 到点 index 的动画

其实两种实现方式都可以，但出于与指示器的 model 一致的考虑，这里我选择了第一种

```javascript
set cur(value) {
  // 绑定对应的关系
  this._cur = value;

  // 先把 marker 设置为当前点
  this.marker.setLatLng(this.points[value]);

  // 执行移动到下一个点的动画
  if (value < this.points.length - 1) {
    this.marker.moveTo(this.points[value + 1], MOVE_TIME);
  }
}
```

这里只是一个简单地示例，在实际场景还需要处理如播放、暂停等情况，还需要加上不同的 state 控制逻辑。这样把 `cur` 的逻辑写好后，指示器的 HTML 就可以直接写成

```html
<indicator [(ngModel)]="cur"></indicator>
```

直接做一个双向绑定就完了！所有的逻辑都放在了 setter 里，对于页面组件来说他们不再需要关心逻辑的细节，他们只需要知道 model 就可以了，这样的解耦使功能的实现和维护都更加的简单、清晰。

