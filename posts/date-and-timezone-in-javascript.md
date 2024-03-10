---
title: Date Format in JavaScript
date: 2018-03-07 10:30:40
tags: [前端]
---

俗话说得好，代码重构火葬场。最近接手了一个微信商城的项目，代码量不是很大，但其中还是有不少的坑可以深陷其中，包括一个关于 JavaScript 的 Date Format 问题。另外网上的很多文章在 Date Format 上的理解略有偏颇，因此结合着 ECMAScript 规范把这部分的知识整理一下。

<!-- more -->

## 时间与时区

时区嘛，简单点讲就是地球上不同地方的时间是不一样的，其中存在一个标准时区的时间，我们叫 UTC 时间。中国位于东八区嘛，所以 CST（中国标准时间）就会比 UTC **快八小时**。举个栗子：

如果标准时间是 2018-01-01 00:00:00，那么在中国的时间就应该是 2018-01-01 08:00:00，因为我们比较快嘛。相反，如果在中国的时间是 2018-01-01 00:00:00，那么标准时间就应该是 2017-12-31 16:00:00， 还没倒数新年呢。这个呢应该比较好理解。

## 怎样 Format 一个 Date

### ISO 8601 & Date Time String Format

首先是 [ISO 8601](https://zh.wikipedia.org/wiki/ISO_8601#%E6%97%A5%E6%9C%9F%E6%97%B6%E9%97%B4%E8%A1%A8%E7%A4%BA%E6%B3%95) 其实是有非常非常多的日期时间定义方式的，而 ECMASCript 只用了一个 Simplified 版本的定义，看 [20.3.1.16 Date Time String Format](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-date-time-string-format) 的定义，可以总结出以下几点：

- 完整的日期时间定义格式为 `YYYY-MM-DDTHH:mm:ss.sssZ`
- `T` 只是作为日期与时间的**分隔符**，没有**实际意义**
- `Z` 代表时间为 UTC 时间，当该时间表示为时区时间时，`Z` 被替换为 `+HH:mm` 或 `-HH:mm` 代表对应的时区
- 有两种类型，一种是 date-only，另一种是 date-time

date-only 包括下面三种：

1. YYYY
2. YYYY-MM
3. YYYY-MM-DD

date-time 就是上面三种的**任意一种**后加上下面的一种：

1. THH:mm
2. THH:mm:ss
3. THH:mm:ss.sss


尤其注意到这句话，广为流传的 ECMAScript 5.1 版是没有的：

> When the time zone offset is absent, date-only forms are interpreted as a UTC time and date-time forms are interpreted as a local time.

也就是说 `Z` 是可以省略的，省略后的字符串如果属于 date-only 类型时，会被解析成 UTC 时间；如果属于 date-time 类型时，会解析成本地时间。

由此可知，ECMASCript 中定义的 Date Time String Format 是**有限**的，当给定一个 String 时，我们可以根据这些规则来判断这个 String 是否满足这里的 Date Time String Format。

### Date.parse 干了啥

实际上，大部分同学都知道 `new Date(string)` 实际上调用了 `Date.parse` 方法，[20.3.2.2Date ( value )](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-date-value)。因此看 [20.3.3.2 Date.parse ( string )](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-date.parse) 中如此说道：

> The function first attempts to parse the format of the String according to the rules (including extended years) called out in Date Time String Format ([20.3.1.16](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-date-time-string-format)). If the String does not conform to that format the function may fall back to any implementation-specific heuristics or implementation-specific date formats.

没错 `Date.parse` 就是先按上文提到的 Date Time String Format 来 format，不满足的话就是 **implementation-specific date formats**。是的，跟不同浏览器的**不同实现**有关，也就是**未定义行为**。

### 浏览器是爸爸

让我们具体来看看不同浏览器对一些典型日期时间串的 format。

```javascript
new Date('2018-01-01')
new Date('2018-1-1')
new Date('2018-01-01T08:00:00')
new Date('2018-01-01 08:00:00')

// Chrome
Mon Jan 01 2018 08:00:00 GMT+0800 (CST) - UTC
Mon Jan 01 2018 00:00:00 GMT+0800 (CST) - 本地
Mon Jan 01 2018 08:00:00 GMT+0800 (CST) - 本地
Mon Jan 01 2018 08:00:00 GMT+0800 (CST) - 本地

// Firefox
Date 2018-01-01T00:00:00.000Z - UTC
Date 2018-01-01T00:00:00.000Z - UTC
Date 2018-01-01T00:00:00.000Z - 本地
Date 2018-01-01T00:00:00.000Z - 本地

// Safari
Mon Jan 01 2018 08:00:00 GMT+0800 (CST) - UTC
Invalid Date
Mon Jan 01 2018 16:00:00 GMT+0800 (CST) - UTC
Invalid Date
```

Surprice Mother Fxxker！

这四个例子中，第一个和第三个是满足 ECMAScript 中 Date Time String Format 的，另外两个是一些我们常用的字符串表示日期时间的格式。

首先不令人意外的是，正如前文所讲，对于不符合 Format 的字符串 format 结果，不同浏览器会有不同的实现，比如第四种带空格的格式，Safari 会直接报错。这也是我上一篇文章中，Angular 使用 date 管道导致 IE11 不兼容的原因。

但更令人意外的是，对于第三种满足 Format 的字符串，居然得出了不一样的结果！Unbelievable！按照规范，`2018-01-01T08:00:00` 是省略了 time-zone 的 date-time 类型，应该按 local time 进行 format，Chrome 与 Firefox 做得很好，而 Safari 却没有遵循规范。

## 万事小心

我们可以看到，即使是大厂浏览器，也没有完全按规范实现，更何况国内众多大大小小的浏览器。因此在处理 Date 的时候，需要保持警觉：

- 后端传时间给前端，使用字符串时，尽量使用**带时区**的**完整** ISO 8601 日期时间字符串，即 `2018-01-01T08:00:00+08:00` 或使用 UTC 时间 `2018-01-01T00:00:00Z` ，否则前端如果使用 `new Date(string)` 进行转换，后果可能不堪设想
- 前端传时间给后端，可以使用标准字符串，也可以直接使用毫秒数，重要的是保持一致
- 正如 jQuery 之所以能够叱咤风云，直接使用 `moment` 等库处理日期时间也不失为一个不错的选择

有部分意见认为日期时间在后端数据库可以统一用 Long 保存，这个数字实际上是一个 UTC 时间，需要显示时格式化为本地时区，需要更新时通过转为 UTC 时间保存。这也是一种不错的实践，但带来的问题是数据库查询中没法看到实际的时间。在 MySQL 下，TIMESTAMP 类型是一个不错的选择。

## 参考资料

1. [关于“时间”的一次探索](https://segmentfault.com/a/1190000004292140)
2. [JavaScript 时间与日期处理实战:你肯定被坑过](https://segmentfault.com/a/1190000007581722)
3. [如何正确地处理时间 - 廖雪峰的官方网站](https://www.liaoxuefeng.com/article/0014132675721847f569c3514034f099477472c73b5dee2000)
