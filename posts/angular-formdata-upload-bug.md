---
title: 激坑！Angular 使用 Http 模块和 FormData 上传文件
date: 2018-01-02 09:48:40
tags: [前端]
---

最近遇见一个常见的需求，便是上传 Excel 文件到后端进行解析。这种东西做得多了，对前端来说无非就是上传个文件，解析的逻辑我又不管的，easy job 啦~

<!-- more -->

对于现代浏览器来说，通过 `FormData` 进行文件上传已经是很通用的做法了，再也不需要使用像构造 form 元素这种方法去做浏览器兼容。可以看到 `FormData` 的兼容性还是可以的。

![CanIUse - FormData](https://static.ryancui.com/images/caniuse-formdata.png)

由于正在使用 Angular，于是直接用自带的 HTTP 服务上传文件吧

```typescript
const file = event.target.files[0];

const formData = new FormData();
formData.append('file', file);

this.http.request(url, new RequestOptions({
  method: RequestMethod.Post,
  body: formData,
  headers: new Headers({
    'Authorization': `Bearer ${token}`
    'Content-Type': 'multipart/form-data'
  })
}));
```

一切都很美好，但后端哥哥反手就丢来一个报错：

```
HTTP Status 400 - Required MultipartFile parameter 'file' is not present
```

纳尼！我去看了下 Chrome dev tool，卧槽文件不见了。为了把锅分得清清楚楚明明白白，快使用 Postman！

![请求正确返回](https://static.ryancui.com/images/postman-result.png)

万念俱灰啊！！！！！！

于是只能不停地 Google，终于找到了这个：

[Form data is empty when calling http.post() with ContentType header](https://github.com/angular/angular/issues/13241)

纳尼！这个 http 模块有 bug！FormData 不能传文件，所以后端拿不到值。

换成最原始的 `XMLHttpRequest`

```typescript
const xhr = new XMLHttpRequest();
xhr.open('POST', url);
xhr.setRequestHeader('Authorization', `Bearer ${token}`);
xhr.send(body);
xhr.onload = () => {
  if (xhr.status === 200) {
    console.log(xhr.response);
  }
};
```

就没有问题了，一切正常。

那个 Issue 的状态是 Closed, 目测可能在 5+ 修复了？我这里的环境是 Angular 4.4.4，无论是使用 `HttpModule` 还是 `HttpClientModule` 进行 `FormData` 的文件上传，后端均拿不到值。
