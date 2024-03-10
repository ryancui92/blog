---
title: Chrome 插件开发小结
date: 2018-10-18 11:32:42
tags: [前端]
---

最近都在做 Chrome 插件的开发，虽然一开始整个插件的框不是我搭起来的，但在过程中遇到的一些问题和解决方法，也值得总结一下。

<!-- more -->

## 使用 Vue.js 开发 Chrome 插件

这个插件在打开的时候会弹出一个操作页面与用户进行交互，这个操作页面可以用 Vue.js 来开发，本质上与开发一个普通的 Vue Web 应用差不多。

那么怎么把这个页面放进需要展示的 Tab 中呢，我们使用了 iframe：

```javascript
const frame_id = this.frame_id
this.frame = $(`#${frame_id}`)
if (!this.frame.length) { // 未渲染
  let indexURL = chrome.runtime.getURL('index.html')
  this.frame = $(`<iframe src="${indexURL}" id="${frame_id}"></iframe>`)
  $(document.body).append(this.frame)
}
```

打包好 Vue 的应用后，通过 `chrome.runtime.getURL` 获取 `index.html` 的路径，往页面添加一个 iframe 显示。

需要注意的是，这个 iframe 的构造和插入是在 Chrome 插件的 content script 中，其实本质上与插件自带的 popup html 选项是一致的，iframe 中加载的 js 也属于插件的 content script.

其他页面的开发方式、Vuex 的使用等与平常使用基本相同。

## 三个区域 Background/Content/Frame 的通信

![页面架构](https://static.ryancui.com/images/structures.png)

采用插入 iframe 的方式，整个应用被划分成了三块：

- Background：常驻在浏览器的 JavaScript 脚本
- Content：打开的网页本来的 JavaScript 脚本（环境）
- Frame：从插件 content script 中调用 js 插入的一个 iframe 的 JavaScript 脚本（环境）

虽然 Content 与 Frame 两部分在 Chrome 插件上均属于 content script 的范畴，但由于 Chrome 插件的限制，这两块的 JavaScript 执行环境并不一致，因此这两部分也需要额外的通信。

通信的方式其实非常原始，简单的发布订阅模式，利用 Chrome 插件提供的 API，分别在每个地方 set up 自己的 listener，并处理相应的事件即可。

### 发布

向 Background 发送消息时可以使用 `chrome.runtime.sendMessage`，而向 Content 或 Frame 发送消息时，由于需要指定对应的 Tab（标签页），需要使用 `chrome.tabs.sendMessage`

### 订阅

三个部分的 listener 都可以使用 `chrome.runtime.onMessage` 来完成事件监听。有一个需要注意的是，`sendMessage` 和 `onMessage` 有一个回调的功能，能使消息发送方接收订阅方的回调（类似于回执一样），看下[例子](https://crxdoc-zh.appspot.com/extensions/messaging)：

```javascript
// 在 Content 发送消息
chrome.runtime.sendMessage({greeting: "您好"}, response => {
  console.log(response.farewell);
});


// 在 Background 订阅消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab
              ? "来自内容脚本：" + sender.tab.url 
              : "来自扩展程序");
  if (request.greeting == "您好") {
    sendResponse({farewell: "再见"}); 
  }
});
```

可以看到订阅方是可以通过一个 `sendResponse` 的回调把数据回送给发送方，而由于我们在三个地方都监听了事件（调用了 `chrome.runtime.onMessage.addListener`），而文档上有说明

> **注意：** 如果多个页面都监听 onMessage 事件，对于某一次事件只有第一次调用 sendResponse() 能成功发出回应，所有其他回应将被忽略。

因此需要合理的规划事件，保证同一类型的事件只会被某一个 listener 所处理，这样才能正确地调用 `sendResponse` 获取回送的数据。

### 规划事件

为了使所有的事件能更好地分门别类，发送事件时使用了这样的数据格式：

```javascript
{
  direction: 'content_to_background',
  area: 'frame',
  operate: 'decrease_active_tabs',
  options: {
    task_id: 'c10103'
  }
}
```

- `direction` - 说明当前事件的流动方向，用于在 listener 处进行筛选事件进行处理
- `area` - 表明当前事件的处理器（或者模块）
- `operate` - 事件类型
- `options` - 自定义参数

通过 `direction` 可以是三部分的 listener 定义复用到一个文件中：

```javascript
chrome.runtime.onMessage.addListener((message, sender, callback) => {
  /**
    * area 表示操作的区域
    */
  const { direction } = message
  switch (direction) {
    case 'background_to_content':
    case 'frame_to_content':
      this.contentListening(message, callback)
      break
    case 'content_to_background':
    case 'frame_to_background':
      this.backgroundListening(message, callback)
      break
    case 'content_to_frame':
    case 'background_to_frame':
      this.frameListening(message, callback)
    default:
      console.log('who cares ?')
  }
  return true // 只有当return true的时候，callback才会将信息返回
})
```

再根据 `area` 分别调用不同的 handler

```javascript
contentListening(message, callback) {
  const { area } = message
  switch (area) {
    case 'frame':
      frame.handle(message, callback)
      break
    case 'selector':
      selector.handle(message, callback)
      break
  }
}
```

最后在具体处理的 handler 中根据事件类型 `operate` 分配处理的函数

```javascript
// 处理 Frame 相关操作的 Handler
class Frame {
  constructor(frame_id) {
    this.frame_id = frame_id
    this.frame = null
  }

  handle(message, callback) {
    const { operate, options } = message
    switch (operate) {
      case 'move':
        this.move(options.position)
        break
      case 'change_width':
        this.changeWidth(options.type)
        break
      case 'toggle_width':
        this.toggleWidth()
        break
      // 更多的事件类型
    }
  }
  // 省略具体的处理...
}
```

## Ajax 请求

可以在 content script 或 background 中发对应的 ajax 请求，两者都能带上对应的 cookies，也没有受到同源策略的影响。但在实践中发现，对于在一些 HTTPS 站点中打开的插件，如果使用 content script 请求 HTTP 的后端接口，会报错。

> Mixed Content: The page at '...' was loaded over HTTPS, but requested an insecure resource ''. This request has been blocked; the content must be served over HTTPS.

因此还是把 ajax 请求放到了 background 的 js 环境中作请求，在 Vue 中封装了一个 `$ajax` 方法：

```javascript
Vue.prototype.$toBackground = function (message) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({
      ...message,
      direction: 'frame_to_background'
    }, res => {
      resolve(res)
    })
  })
}

Vue.prototype.$ajax = async function (options) {
  const result = await this.$toBackground({
      area: 'ajax',
      operate: 'request',
      options
    })
  }

  return result
}
```

同时在 background 的 listener 中配置好 area 为 ajax 的 handler，这样就可以通过通信在 background 环境请求后端接口了。

## 日常开发配置

在开发 Chrome 插件的时候，其实大部分时间都是在开发页面（Vue.js 部分），因此每次都 build 到本地，到 Chrome 扩展商店刷新，大大降低了效率。因此可以通过检查当前环境是否为插件环境，来禁止调用一部分插件环境才支持的 API，从而达到在普通 Web Server 中开发 Vue.js 页面的需求。

```javascript
// 判断当前的环境是否是插件环境
export const is_extension_env = window.location.protocol === 'chrome-extension:'

// 对所有使用了插件 API 的地方进行配置
Vue.prototype.$toBackground = function (message) {
  return new Promise(resolve => {
    if (is_extension_env) {
      chrome.runtime.sendMessage({
        ...message,
        direction: 'frame_to_background'
      }, res => {
        resolve(res)
      })
    } else {
      resolve({})
    }
  })
}

// 如果是普通环境，直接调用 ajax 请求不需要通过消息
Vue.prototype.$ajax = async function (options) {
  let result

  if (!is_extension_env) {
    result = await new Promise(resolve => request.handle({ options }, resolve))
  } else {
    result = await this.$toBackground({
      area: 'ajax',
      operate: 'request',
      options: options
    })
  }

  return result
}
```

这样就可以直接使用 `npm run dev` 打开网页进行普通的 Web 网页开发调试了。当然一些需要用到 chrome.* API 的功能还是需要进行 build 后实际调试。

## 参考资料

- [入门：建立 Chrome 扩展程序](https://crxdoc-zh.appspot.com/extensions/getstarted)

