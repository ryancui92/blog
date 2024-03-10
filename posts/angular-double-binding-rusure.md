---
title: 你确定要用 Angular 双向绑定吗？
date: 2017-11-07 11:35:42
tags: [前端]
---

## 源起...

在写一个文件上传组件的时候，在上层把文件列表 `files: UploadFile[]` 传给组件，打算用双向绑定。例如这样：

<!-- more -->

```typescript
_files: UploadFile[] = [];

@Output() filesChange = new EventEmitter();

@Input()
get files() {
  return this._files;
}

set files(v) {
  this._files = v;
  this.filesChange.emit(v);
}
```

在写到某个删除文件方法的时候，突然发现，貌似这个 setter 根本没有进去啊

```typescript
this.files.splice(i, 1);
```

`files` 本身就是一个数组，引用没变就没有进 setter，那上层的变量不就没变了吗？赶紧去父组件看一看，却发现数组还真的删掉了一个文件。

**WHAT THE FUCK???**

## 智障...

这个问题困扰了我二十分钟，期间我不停地 Google `Angular double binding object/array`，发现没人遇到和我一样的问题啊，网上的例子都是用的 Primitive value, 没人用数组做例子的吗？为什么没进 setter 都能变啊，好难啊！

最后突然灵光一闪，特么我改的就是同一个数组啊，为什么要 emit 这个 change 呢？mdzz

## 感悟...

- 所以一个 Reference value 为什么要双向绑定呢？你会在组件内部 reset 掉这个地址吗？直接用就好了
- 用 Reference value 传递数据会导致数据既能在子组件内部被改，父组件也能改，到底谁负责任？说好的单向数据流呢？
- 但看了一下 NG-ZORRO 的 Table 组件实现，的确它的 `data[i].checked` 就是两边都能改的
- 如果用 `ChangeDetectionStrategy.OnPush`，Reference value 还会导致组件 view 无法被 rerender
