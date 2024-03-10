---
title: Angular 兼容 IE 过程遇到的问题
date: 2018-02-06 09:54:05
tags: [前端]
---

由于众所周知的原因，Web 应用还是需要兼容 Windows 下最「著名」的浏览器 Internet Explorer 的，可能现在不需要再兼容到 IE6 这么低的版本，但 IE9/10/11 的兼容可能也够麻烦了。

由于我们使用的 Angular + NG-ZORRO-ANTD，两者的官网都说能支持 IE9+，因此我们愉快地开始了 IE 兼容的踩坑之旅。

<!-- more -->

## 开启官方提供的 Polyfills

查阅的无数资料第一步准是让你把 angular-cli 生成项目中的 `polyfills.ts` 中的**一切**都打开，本着「加载慢不慢先不管，能不能用最重要」的原则，我们当然把全部都打开了。

```
$ npm install --save classlist.js
$ npm install --save web-animations-js
$ npm install --save intl
```

把注释里的全部安装完毕，以为兼容 IE 就是这么 Easy, 打开网页依然是一堆的报错...

## 逐个击破

### date 管道解析报错

我们后端返回的日期时间类型是一个形如 `YYYY-MM-DD HH:mm:ss` 的字符串，当使用自带的 `date` 管道进行格式化时：

```html
{{startDate | date: 'YYYY年MM月DD日'}}
```

报错了，IE11 无法将不标准的日期字符串转换为 `Date` 对象，因此需要**自定义**一个日期时间格式化管道。

**Solved**

### IE11 报错「不能执行已释放 Script 的代码」

在 IE11 下会报这个错，错误定位的代码是这样：

```javascript
var testString = delegate.toString();   // <===== HERE!
if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
    nativeDelegate.apply(target, args);
    return false;
}
```

去搜了一下，马上就找到解决方法了，出错原因可以看里面的解释。

[Angular 4 app using IE 11, “Can't execute code from a freed script”](https://stackoverflow.com/questions/45675781/angular-4-app-using-ie-11-cant-execute-code-from-a-freed-script)

[Angular 4 put a global constant available to zone.js](https://stackoverflow.com/questions/45691804/angular-4-put-a-global-constant-available-to-zone-js)

一模一样的情况，在 `index.html` 加上一行 `script` 把那个全局变量加上去。

```html
<body>
  <app-root></app-root>
  <script>
    window['__Zone_disable_IE_check'] = true;
  </script>
</body>
```

**Solved**

### Array.prototype.includes polyfills

在项目中使用了 `Array.prototype.includes` 这个 ES7 新特性，需要额外的 polyfills，否则 IE 不支持。到 MDN 找一下就好。

[MDN - Array.prototype.includes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)

我们新建了一个 `src/polyfills.js` 并在 `polyfills.ts` 的最后 import 进去，把自己实现的 polyfill 放到 js 文件里。

**Solved**

### IE10 Flexbox 支持

> 如果要兼容到 IE9，你可以忽略这部分内容了，请禁止你（和团队）使用 Flexbox 吧 :Smile:

在业务中，非常频繁的使用了 Flexbox 布局，CanIUse 上表示 Flexbox 对 IE11 也只是部分支持，IE10 直接标红了。但其实 IE10 能够通过 prefix 来实现。

```css
div {
  display: -ms-flexbox;
}
```

那当然不可能手动每个 div 加啊，我们需要 PostCSS 的 Autoprefixer，经过一番查找，发现 angular-cli 已经集成了 autoprefixer（╰(*°▽°*)╯），配置一下浏览器列表就能起效了。

[Change target browsers for Autoprefixer](https://github.com/angular/angular-cli/wiki/stories-autoprefixer)

**Solved**

### IE11 无法获取未定义或 null 引用的属性 "call"

这个问题是一个量子态的问题，偶尔会出现，但关掉 IE 再重启又没问题了，真的是来搞笑的。

暂时认为是 livereload 导致的代码片段出错，不处理。

**Observe**

### IE9 不支持 FileReader

我们实现的图片上传组件，使用了 `FileReader` 来获得图片的 base64 编码，并通过编码上传的服务器。但在 IE9 下，并不支持 `FileReader`.

其实我们只需要能够将图片转成 base64 编码就可以了，查了一下可以用 canvas 来转诶，而且 canvas IE9 也支持，可以尝试。

**Under development**

### IE10 使用了 [hidden] 隐藏元素

在一些自定义的组件中，对一些元素使用了 `hidden` 属性来进行隐藏，在 IE10 下会无法隐藏。

```html
<span class="close"
      [hidden]="!allowRemove || !showControlBtn[i]">
</span>
```

很可惜，`hidden` 在 IE10 上[并不支持](https://caniuse.com/#search=hidden)。

改成利用 `display: none` 来隐藏，问题解决。

```html
<span class="close"
      [class.close-not-exist]="!allowRemove || !showControlBtn[i]">
</span>
```

**Solved**

### IE9 requestAnimationFrame undefined

如果使用了 Angular 的动画 `@angular/animation`， 在 IE9 下会由于[不支持](https://caniuse.com/#search=requestAnimationFrame) `requestAnimationFrame` 而报错。自行加上对应的 [Polyfill](https://gist.github.com/paulirish/1579671) 即可。

需要注意的是，这个 `requestAnimationFrame` 的 polyfill 需要在 Angular 自带的 `polyfills.ts` 之前引入，因为下面的代码会用到这个函数，把 import 语句放在 `polyfills.ts` 的开头即可。

**Solved**

### IE11 下改变 file input value 会重新触发 change 事件

这个跟 Angular 关系不大，我们实现的不少图片上传或文件上传组件，做法都是隐藏一个 input 框，当有某些 click 事件时调用 `input.click()` 调出文件选择器，选择后通过 `change` 事件处理。

在 `change` 的处理函数的最后，会有这么一句

```javascript
this.fileEle.nativeElement.value = '';
```

在每次处理完用户选择的文件后，把该 input 框的值清空。这么做的原因是 `change` 事件只有在文件变化时才被触发，当需要处理两次上传同一个文件的情况时

- 第一次选择了文件 A，第二次依然选择了文件 A

符合组件预期的行为应该是调用两次 `change` 回调。这里需要说明的是，`change` 本身的语义是没有问题的，只有文件变化才调用，但组件层面上的语义应该是每次用户选择了文件都执行一个回调，因此单纯的 `change` 事件不能满足需求。

因此每次把 `value = ''` 即可解决这个问题。

但在 IE11 的实现认为，设置 `value` 相当于改变文件，也需要调用 `change` 回调（Chrome / Firefox 甚至 IE10 也不会调用），因此 `change` 回调执行了两次，其中第二次的 `e.target.files` 为空数组，需要特别的处理。

> 这里有个[知乎上的讨论](https://www.zhihu.com/question/62288493)，对 input file 的特性还需要进一步实践，先记录下来

**Solved**

### IE9 下 Int32Array undefined

在 IE9 下，启动应用并进入时控制台会报这个错，`Int32Array undefined` 之类的。找到了[这个](https://github.com/angular/angular/issues/11831)，加上新的 polyfill 即可。

```typescript
import 'core-js/es6/typed';
```

