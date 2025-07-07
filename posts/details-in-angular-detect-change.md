---
title: Angular 变化检测中的细节
date: 2018-02-28 14:04:34
tags: [前端]
---

年前在公司举行了一场盛况空前（误）的前端分享会，我在会上大谈特谈了关于 Angular 的变化检测机制，就在即将迎来完美的收官之时，总是会有淘气鬼提出各种奇奇怪怪的问题，让人不胜其烦（大误）。由于当时无言以对、支支吾吾，便只好会后一番仔细研究后，发出文章以正视听。望日后能弓调马服再大谈特谈（逃

<!-- more -->

> 文中提及的 Angular 源码均基于 [Angular 官方仓库 tag 4.4.6](https://github.com/angular/angular/tree/4.4.6)

## onPush 也会触发 View 更新？

### Question

淘气鬼的第一个问题是关于 onPush 策略下 View 的更新问题。

首先是一段网上举例再多不过的关于使用 Observable + onPush 来减少组件变化检测的代码：

```typescript
@Component({
  selector: 'app',
  template: `
    <button (click)="emit()"></button>
    <sub-a [observable]="subject"></sub-a>
  `
})
export class AppComponent {
  subject = new Subject();
  
  emit() {
    this.subject.next(Math.random());
  }
}

@Component({
  selector: 'sub-a',
  template: `
    <p>{{local}}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubAComponent implements OnInit {

  local;
  
  @Input() observable;

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.observable.subscribe(value => {
      this.local = value;
      // this.changeDetector.markForCheck();
    });
  }
}
```

毫无疑问地，了解过 `ChangeDetectionStrategy.OnPush` 的同学都明白，此时 sub-a 组件的 `local` 值虽然被改变了，但由于没有调用 `markForCheck` 方法，且所有 `@Input` 属性没有发生改变，Angular 会跳过该组件（及其子组件）的所有变化检测，因此页面并不会更新。去掉这个 `markForCheck` 方法的注释，页面就能够得到更新了。具体可以去查阅其他关于 `OnPush` 策略的文章。

好了，这时候淘气鬼说，那如果我们不是改变一个 `@Input` 的变量，而是一个内部变量呢？View 会更新吗？即：

```typescript
@Component({
  selector: 'app',
  template: `
    <sub-a></sub-a>
  `
})
export class AppComponent {
}

@Component({
  selector: 'sub-a',
  template: `
    <button (click)="change()"></button>
    <p>{{local}}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubAComponent implements OnInit {

  local;
  
  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
  }
  
  change() {
    this.local = Math.random();
  }
}
```

这里直接把父子组件间的变量传递去掉了，方便理解。我一开始是认为**View 不会更新**，原因是既然输入属性没有发生改变，那这个 `SubA` 组件的变化检测就应该被 skip 掉。然而：

**他变了。**

简直击碎了我的世界观。

### 更诡异的情况

在我阅读众多资料对 `OnPush` 策略与 Angular 变化检测的理解中，点击按钮后所发生的应该是：

click event => ngZone 捕获，开始一次从根的变化检测 => 到 OnPush 策略的组件，跳过 => 页面不会更新

是哪里出了问题呢？抱着疑问在 Google 的帮助下四海为家（误），期间也咨询了不少人，但也得不到满意的答复，直到在[官网](https://angular.io/api/core/ChangeDetectorRef)的 API 上看到这样一个例子：

```typescript
@Component({
  selector: 'cmp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `Number of ticks: {{numberOfTicks}}`
})
class Cmp {
  numberOfTicks = 0;

  constructor(private ref: ChangeDetectorRef) {
    setInterval(() => {
      this.numberOfTicks++;
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 1000);
  }
}

@Component({
  selector: 'app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cmp><cmp>
  `,
})
class App {
}
```

这个例子跟淘气鬼的例子很像，区别只在于官网使用了 `setInterval` 来触发 ViewModel 的更新，而淘气鬼就搞了个按钮。

但是，这个 `setInterval` 居然是**不会**更新 View，而点击按钮却是**会**更新 View，纳尼？这两个对 zone 来说不是都是异步吗？都是触发一轮变化检测吗？

把淘气鬼的例子改了下，发现的确如此，调用同一个函数 `change`，每一秒的定时任务 View 不会更新，点击按钮界面就能更新！WHY？如此看来那应该是 `ngZone` 对这两种异步事件的处理有区别。

```typescript
@Component({
  selector: 'app',
  template: `
	<sub-a></sub-a>
  `
})
export class AppComponent {
}

@Component({
  selector: 'sub-a',
  template: `
    <button (click)="change()"></button>
    <p>{{local}}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubAComponent implements OnInit {

  local;
  
  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    setInterval(() => {
      this.change();
    }, 1000);
  }
  
  change() {
    this.local = Math.random();
  }
}
```

### 调用绑定事件会自动 markForCheck

在 StackOvewflow 上搜索一番，果然还是皇天不负有心人啊

[Angular OnPush Component, when trigger event in view angular force markForCheck automatically?](https://stackoverflow.com/questions/45287556/angular-onpush-component-when-trigger-event-in-view-angular-force-markforcheck)

原来原因是，对于 DOM 中绑定的事件，会在内部自动把 `markForCheck` 帮你调用了。来我们看看源码：

```typescript
// packages/core/src/view/provider.ts - L134

export function createDirectiveInstance(view: ViewData, def: NodeDef): any {
  // Omit...
  
  if (def.outputs.length) {
    for (let i = 0; i < def.outputs.length; i++) {
      const output = def.outputs[i];
      const subscription = instance[output.propName !].subscribe(
          eventHandlerClosure(view, def.parent !.nodeIndex, output.eventName));
      view.disposables ![def.outputIndex + i] = subscription.unsubscribe.bind(subscription);
    }
  }
  return instance;
}

function eventHandlerClosure(view: ViewData, index: number, eventName: string) {
  return (event: any) => {
    try {
      return dispatchEvent(view, index, eventName, event);
    } catch (e) {
      // Attention: Don't rethrow, as it would cancel Observable subscriptions!
      view.root.errorHandler.handleError(e);
    }
  };
}
```

这里只需要看到绑定事件的处理函数是 `eventHandlerClosure`，而这个处理函数则是调用了 `dispatchEvent`。

```typescript
// packages/core/src/view/util.ts - L128

export function dispatchEvent(
    view: ViewData, nodeIndex: number, eventName: string, event: any): boolean {
  const nodeDef = view.def.nodes[nodeIndex];
  const startView =
      nodeDef.flags & NodeFlags.ComponentView ? asElementData(view, nodeIndex).componentView : view;
  markParentViewsForCheck(startView);
  return Services.handleEvent(view, nodeIndex, eventName, event);
}
```

而 `dispatchEvent` 则是调用了 `markParentViewsForCheck`。没错就是这个通知了 Angular 触发 View 更新，我们来看看 `ChangeDetectorRef.markForCheck` 的源码。

```typescript
// packages/core/src/view/refs.ts - L248

export class ViewRef_ implements EmbeddedViewRef<any>, InternalViewRef {

  // Omit...
  
  markForCheck(): void { markParentViewsForCheck(this._view); }
  
  // Omit...
}
```

没错，`markForCheck` 的内部就是通过 `markParentViewsForCheck` 实现的。

总结下来，其实我的理解是没错的，使用了 `OnPush` 策略，无论如何改变变量，只要没有 `markForCheck`，View 的确是不会更新的。

### OnPush 会更新 View 的情况

那篇 StackOverflow 有个介绍 `OnPush` 策略下什么情况会更新 View 的总结，顺带也搬运一下。

[Change Detection issue — Why is this changing when it's the same object reference with On Push](https://stackoverflow.com/questions/42312075/change-detection-issue-why-is-this-changing-when-its-the-same-object-referen)

#### `@Input` 属性改变

这是最通常的理解了。内部通过将 `ViewState` 置为 `ChecksEnabled` 使组件重新加入变化检测。

```typescript
// packages/core/src/view/provider.ts - L424

function updateProp(
    view: ViewData, providerData: ProviderData, def: NodeDef, bindingIdx: number, value: any,
    changes: SimpleChanges): SimpleChanges {
  if (def.flags & NodeFlags.Component) {
    const compView = asElementData(view, def.parent !.nodeIndex).componentView;
    if (compView.def.flags & ViewFlags.OnPush) {
      compView.state |= ViewState.ChecksEnabled;
    }
  }
}
```

#### 组件内触发绑定事件

也就是上文分析的情况。

#### 手动调用 markForCheck

这个也没有问题，手动把该组件重新设置为可 Check。

#### Async pipe

这个我也真没想到，async pipe 内部也自动调用了 `markForCheck`，不过考虑到它连销毁都自带了，这也可以理解。

```typescript
// packages/common/src/pipes/async_pipe.ts - L139

private _updateLatestValue(async: any, value: Object): void {
  if (async === this._obj) {
    this._latestValue = value;
    this._ref.markForCheck();
  }
}
```

## ViewCheck 的执行顺序

### Question

这是淘气鬼的第二个问题，在展示组件生命周期钩子调用顺序的时候，有如下的组件树（丑）结构：

请问他的 `ngAfterViewChecked` 钩子的执行顺序是啥呢？

我一开始以为会是 BDCA，没错就是一个树的后序遍历。但现实却是 DBCA！这是什么鬼！

### 到底是谁 Check 谁？

这个其实怪我一时没有明白 Change Detection 的步骤，这里强烈推荐我认为全网写得最好的关于 Angular 变化检测的文章：

[Everything you need to know about change detection in Angular](https://blog.angularindepth.com/everything-you-need-to-know-about-change-detection-in-angular-8006c51d206f)

里面总结了对于每个组件一轮变化检测要执行的步骤，重点关注 10) 和 12) 步：

> 10) runs change detection for a child view (repeats the steps in this list)
>
> 12) call `AfterViewInit` and `AfterViewChecked` lifecycle hooks on **child component** instance (`AfterViewInit` is called only during first check)

整个步骤看下来，我们发现了这样两件事。

第一，子组件的递归变化检测是在调用 `ViewCheck` 钩子**前**进行的。

第二，比如，当组件 A 执行完一轮变化检测后，`A.ngAfterViewChecked` **并没有**被调用。仔细查看每一个步骤，对组件 A 的变化检测中，确实没有调用 A 的 `ViewCheck` 钩子这样的步骤。那这个钩子是在什么时候调用的呢？

回到上面提到的 12) 步，对于每个组件的一轮变化检测，需要去调用**子组件**的 `ViewCheck` 钩子。因此，比如，A 组件的 `ViewCheck` 钩子是谁调用的呢？就是 A 组件的父组件调用的，而不是 A 自身，是 A 的父组件去确认 A 已经 Check 了。

理解了这两个以后，上面那个组件树的 `ViewCheck` 调用顺序就非常清晰了。

### 详细描述

针对上图的组件树，只 focus 递归变化检测和 ViewCheck 下的具体调用情况如下：

1. A Begin Change detection
2. A 组件有两个子组件 B/C
3. B Begin Change detection
4. B 调用所有子组件的 ViewCheck 钩子（无输出）
5. B End Change detection
6. C Begin Change detection
7. C 组件有子组件 D
8. D Begin Change detection
9. D 调用所有子组件的 ViewCheck 钩子（无输出）
10. D End Change detection
11. C 调用所有子组件的 ViewCheck 钩子（输出 D）
12. C End Change detection
13. A 调用所有子组件的 ViewCheck 钩子（输出 B C）
14. A End Change detection

这样下来，DBCA 的输出就非常显而易见了。

### 无奖问答

看看你掌握了吗？下面这个组件树的 `ViewCheck` 钩子顺序是啥呢？

答案看后文的图片。

### ContentCheck

值得注意的是，`ContentCheck` 的顺序跟 `ViewCheck` 十分类似，也是父组件的变化检测中调用**子组件**的钩子，只不过这是在递归之前进行的调用。

上文的两个组件树的 `ContentCheck` 顺序分别为：ABCD 和 ABDCEF，看看能不能明白？

## 总结

总的来说，淘气鬼的问题基本上都解决了，算是可喜可贺，普天同庆了。Angular 果真是博大精深，看源码都要看晕了，不过也多亏了淘气鬼，让我对 Angular 变化检测的理解又上了一个台阶。另外也可以看出像 Angular 这样的大框架要是没有 TypeScript 来支持，真的是鬼才看得懂它的代码咯。
