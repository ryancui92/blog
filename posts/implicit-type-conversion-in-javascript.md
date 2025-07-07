---
title: JavaScript 中的隐式类型转换的规范
date: 2018-04-02 10:29:09
tags: [前端]
---

本文从 ECMAScript 规范的角度尝试征服 JavaScript 的真值表！全文都是规范，不要方，正面刚！

<!-- more -->

## 小试牛刀

如果你能把下面的所有题目都答对并解释清楚来龙去脉，恭喜你，你已经是大神级别了！答案就请自行找个 Console 实际敲敲，Believe me，你会大吃一斤的。

```js
// 每个表达式是 true 还是 false 呢？为啥呢？

// 初阶
!{}
12 == '12'
'false' == false
null == undefined

// 高阶
[] == []
[] == false
[] === false
[45] == 45

// 终阶
[45] < [46]
[10] < [9]
{} == !{}
{} != {}
-0 === +0
NaN === NaN
NaN != NaN
```

## 深入规范

江湖传闻 JavaScript 有张让人闻风丧胆的**真值表**，我觉得吧只要把每种类型是怎么判断的弄清楚，其实是不需要去记忆这样的表的。因此我们需要了解规范里是怎么处理这些表达式的。

规范中关于上面那堆表达式是怎样求值的有好几处地方的说明，包括

- [7.1 Type Conversion](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-type-conversion)
- [7.2 Testing and Comparison Operations](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-testing-and-comparison-operations)
- [12.5.9 Logical NOT Operator ( `!` )](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-logical-not-operator)
- [12.10 Relational Operators](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-relational-operators) 

### Type Conversion

#### Built-in Types

这部分规定了不同 Type 之间转换时，应该如何进行转换。在此之前需要了解 ECMAScript 到底定义了多少种 Type？

ECMAScript 一共定义了七种 built-in types，因此在节 [6.1 ECMAScript Language Types](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-ecmascript-language-types) 共有七个小节，分别详细解释七种类型。 其中六种类型为 **Primitive Value**.（余文所有加粗的类型均表示 ECMAScript Language Type，没有加粗表示 JavaScript 中的类型）

> A primitive value is a member of one of the following built-in types: **Undefined**, **Null**, **Boolean**, **Number**, **String**, and **Symbol;** an object is a member of the built-in type **Object**; and a function is a callable object.

想去了解详情的可以去看看规范，里面关于 Number 类型的解释会让人豁然开朗的。这里只需要知道 `null` 这个值是属于 **Null** 类型，而 `undefined` 是属于 **Undefined** 类型的。

另外这里的 **Object** built-in type 跟我们平常理解的 JavaScript 里的 `Object` 并不一样，总的来说只要不属于 Primitive Value 的值，就属于 **Object** 类型。比如开发中常见的数组、对象、`Date`、`RegExp` 等在 ECMAScript 中均属于 **Object** 类型。

#### ToPrimitive

**ToPrimitive** 用于将 **Object** 转为 **Primitive Value**

先忽略那堆 `preferredType` 的东西，对于平常遇到的对象（Object）来说，基本上都是 Ordinary 的，所以其实就是默认了 `hint = number` 再去调用 `OrdinaryToPrimitive`。

由于进来的 `hint` 是 `number` 所以这个转换就是：

- 调用 `Object.valueOf`，如果结果是 **Primitive Value**，则返回
- 调用 `Object.toString`，如果结果是 **Primitive Value**，则返回
- 都不是，返回 TypeError

如果看过红宝书的话，里面其实也讲到这部分内容，这里可以从规范的角度再一次说明。

然后来看看普通对象和数组的这两个方法返回的是什么。

```javascript
var a = [12]
var b = {a: 123}

// [12]
a.valueOf()

// '12'
a.toString()

// {a: 123}
b.valueOf()

// '[object Object]'
b.toString()
```

可以看到两者的 `valueOf` 返回的**都不是 Primitive Value**（返回了自身，还是属于 **Object** 类型），根据规范两者调用 **ToPrimitive** 返回的将是一个**字符串**，这一点非常重要。

#### ToBoolean

这个方法用于将不是 **Boolean** 类型的值转换为 **Boolean** 类型。

注意几点就可以了：

- 所有 **Object** 类型都会被转换为 true
- **Number** 类型中的 0、NaN 会被转换为 false，其他都是 true
- 只有空串才为 false，其他都是 true（`'false'`/`'0'` 之类的不要搞错）

#### ToNumber

同理，其他类型转换为 **Number** 类型。

有比较诡异的几点：

- `undefined` 会被转为 NaN；而 `null` 是转为 +0
- `true` 转为 1；`false` 转为 +0（这个很重要）
- **String** 的转换策略不是本文的重点，可以先理解为满足数字语义（即规范下文的 *StringNumericLiteral*）的就转换成数字，不符合就是 NaN
- **Object** 类型的转换，看到了我们的老朋友 **ToPrimitive** 了没？先转成 **Primitive Value**，再递归调用自身 **ToNumber** 来做转换的

到了这一步，看看是否理解了？

```javascript
// '56' ==> 56
Number([56])

// ',56' ==> NaN
Number([,56])

// '55,56' ==> NaN
Number([55, 56])
```

这里的转换是分两步的，**先**转换成字符串，**再**转换成数字，这个很重要。

### Logical NOT Operator

了解完上面几个转换后就可以来看那一堆表达式了！首先是简单点的单目逻辑非，规范是这样的：

哇哦，就是直接调用了 **ToBoolean**，然后取反返回。

```javascript
// [] ==> true; false
![] 

// {} ==> true; false
!{}

// NaN ==> false; true
!NaN
```

嗯，应该没什么大问题。

### Comparison Operations

大 boss 来了，有不少文章都有介绍 `==` 和 `===` 的异同，直接看规范依然是最好的。

#### Evaluation

`GetValue` 就是计算一下表达式的值，`==` 和 `===` 的结果重点在 **Abstract Equality Comparison** 和 **Strict Equality Comparison** 这两个操作里。

另外 `!=` 和 `!==` 则是指出了 `A != B` 与 `!(A == B)` 是**完全等价**的。在判断 `!=`/`!==` 时，其实就是在判断 `==`/`===`.

#### Abstract Equality Comparison

好长啊，不要慌，中文翻译一下：

- 如果 **Type** 相同，等价为 `A === B`
- 特别地，`undefined == null`
- **String** == **Number**，则把 **String** 转换成 **Number**
- 有 **Boolean** 值的，将 **Boolean** 转换成 **Number**
- **Object** == **String/Number/Symbol**，将 **Object** 转换成 **Primitive Value**
- 否则，返回 false

结合小试牛刀的例子来说明

```javascript
// '12' ==> 12; 
// 返回 true
12 == '12'

// 转 boolean: [] == 0
// 转 object: '' == 0
// 转 string: 0 == 0
// 返回 true
[] == false

// 转 object: '45' == 45
// 转 string: 45 == 45
// 返回 true
[45] == 45

// 单目: {} == false
// 转 boolean: {} == 0
// 转 object: '[object Object]' == 0
// 转 string: NaN == 0
// 返回 false
{} == !{}
```

可能有部分同学对于 `[] == false` 的转换过程中居然会出现 `'' == 0` 这一步感到诧异，啊！空数组不是直接就转成数字 0 的吗，然后跟 0 比较的吗？

同样使人困惑的还有 `0 == {}` 这个转换过程中会出现的 `'[object Object]'` ，原因是，最后将 **Object** 转换为 **Primitive Value** 调用的 **ToPrimitive**，在前文已经提到，对于数组和普通对象而言，转换出来的是 String，而不是 Number。为了证明这一点，我们尝试改写 Object 或 Array 上的 valueOf 方法和 toString 方法。

```javascript
console.log([] == false)

Array.prototype.toString = function () {
  return '1'
}

console.log([] == false)
console.log([] == 1)
```

可以看到两次的输出是不一样的，覆盖了默认的 `toString` 方法后，`[] == 1` 输出了 `true`，因为此时数组的 **ToPrimitive** 方法返回的是字符串 `'1'`，同理 Object 的情况也是如此。（顺便可以验证 `valueOf` 确实是优先于 `toString` 方法的）

```javascript
console.log('[object Object]' == {})

Object.prototype.toString = function () {
  return '1'
}

Object.prototype.valueOf = function () {
  return '2'
}

console.log('[object Object]' == {})
console.log(1 == {})
console.log(2 == {})
```

#### Strict Equality Comparison

- 类型不同，直接返回 false
- **Number** 类型判断：有 NaN 就 false；+0 === -0；
- 最后调用 **SameValueNonNumber**

总的来说，严格相等没有非严格相等这么多情况跟转换（毕竟就是同一类型了），记住了 NaN 的 corner case 和对象引用本身相等才是 true 就 ok 了。

```javascript
// 类型相同，等价于 [] === []
// 返回 false
[] == []

// 等价于 !({} == {})
// 等价于 !({} === {})
// 返回 true
{} != {}

// 等价于 !(NaN == NaN)
// 等价于 !(NaN === NaN)
// 返回 true
NaN != NaN

// 类型不同，返回 false
[] === false
```

### Relational Operators

搞掂了相等，不等怎么办？不等关系是由 **Abstract Relational Comparison** 定义的。

这个是真的长，其实注意两点就可以了

- 两边操作数调用 **ToPrimitive** 转换为 **Primitive Value**
- 由于 **Primitive Value** 出来有 **String** 和 **Number** 两种结果，分别有不同的比较规则；String 按 code unit 比较，Number 需要处理 +0/-0/NaN/Infinity 等情况

解释下上面的题目

```javascript
// 注意转换后为 '45' < '46'
// 按字符串规则比较，返回 true
[45] < [46]

// 同理 '10' < '9'，则是返回 false
[10] < [9]
```

## 指导意义

了解这些对实际开发工作有什么现实意义吗？额，很可能是没有的，大多都是各种面试题（笑。

但了解背后的原理对于一些关于类型转换带来的 Bug 的定位和如何去做实际编码中的最佳实践能提供很大的帮助。举两个🌰

初始化订单吧。

```javascript
if (!$scope.orders) {
  $http.post('/api/orders', $scope.params).then(res => {
    $scope.orders = res.data
  })
}
```

然而有人很有责任感地进行了数据初始化：`$scope.orders = []`，GG！

用户没有选择状态就弹出提示。

```javascript
if (!this.editForm.status) {
  this.warning('请选择状态')
}
```

这不会是个数组了吧，很不幸，后端同学定义的 `status` 里有个 0...有个 0..有个 0.

## 参考

- [ECMAScript® 2017 Language Specification (ECMA-262, 8th edition, June 2017)](http://www.ecma-international.org/ecma-262/8.0/index.html)
- [聊聊类型转换](https://ppt.baomitu.com/d/e6515023#/)
