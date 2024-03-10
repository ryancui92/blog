---
title: 再聊箭头函数 Arrow Function
date: 2017-08-30 13:14:40
tags: [前端]
---

昨天面试的时候问了一个关于箭头函数的问题，回来发现好像自己说错了（装逼失败），于是便重新认识一下这个 ES6 用得最多的东西。

<!-- more -->

这段时间面试了很多人，当问到箭头函数带来的好处时，大部分人都只说到了写得少（？？？）
，不需要用 `that`、`self` 之类的变量，可以直接使用 `this`。但当细问下去，其实很多人不了解箭头函数的 `this` 就是是啥回事（或者包括我自己

先说说在此之前我对箭头函数的理解吧：箭头函数里的 `this` 是「继承」的，本身不存在自己的 `this`，当调用到 `this` 时用的其实是上一层作用域的 `this`。现在看来这个理解还是有一定偏差。

## 闭包与词法作用域

摘录一段犀牛书的代码，就能很好说明闭包和词法作用域的问题了：

```javascript
var scope = 'global scope';
function checkscope() {
  var scope = 'local scope';
  function f() { 
    return scope; 
  }
  return f;
}
checkscope()();
```

这里返回的是 `'local scope'`，是因为在函数 f 函数体内访问 `scope` 变量时，会沿着从 f **开始**的作用域链往上查找，因此第一个查找到的变量是在 `checkscope` 作用域内定义的 `scope`。

注意无论 f 在何时何地调用，返回的 `scope` 总是 `'local scope'`，这是由于作用域查找**总是**从 f 开始，因此 `scope` 的值通过**词法作用域**确定了。

## Function 的 this

在 ES5 中，函数中的 `this` 是动态变化的，会根据调用方式的不同产生不同的绑定，只有在被调用时才能确定 `this` 的值：

- 普通函数调用时，全局对象（浏览器下非严格模式 `window`）
- 作为对象方法调用时，为该对象
- 作为构造函数调用时，为新对象的引用
- 使用 `call`、`apply` 调用，为绑定的值（第一个参数）

用代码说明一下：

```javascript
function f(change) {
  if (change) {
    this.a = 300;
  }
  console.log(this.a);
}

var a = 100;
var obj = {
  a: 200
};

// 普通调用，输出 100
f();

// 方法调用，输出 200
obj.f = f;
obj.f();

// 构造函数调用，改变的是新对象的 a，输出 300, 100, 300
var newObj = new f(true);
console.log(a);
console.log(newObj.a);
```

## Arrow Function 的 this

先看 MDN 的说明：[MDN - 箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，其实写得很清楚了。关键在于箭头函数的 `this` 是词法作用域绑定这个概念。这意味着箭头函数的 `this` 类似于一个变量，在定义的时候就已经确定了指向的上下文，而非动态获取。看个例子：

```javascript
var a = 100;
var obj1 = {
  a: 200,
  b: () => {
    console.log(this.a);
  }
};
obj1.b();

var obj2 = {
  a: 200,
  b: function () {
    var f = () => {
      console.log(this.a);
    }
    f();
  }
};
obj2.b();
var ff = obj2.b;
ff();
```

在箭头函数中，`this` 可以看成是一个变量，而非关键字，箭头函数本身作用域里并没有 `this` 的定义，当引用 `this` 时，会沿着作用域链往上查找（跟闭包那个 `scope` 好像哦）。

因此例子中的 `obj1.b()` 跟 `obj2.b()` 输出分别为 100 和 200，由于 `obj1.b` 在查找 `this` 时会一直查找到**全局作用域**，因此 `this.a = 100`；而 `obj2.b` 在 `function` 作用域就找到了 `this`**（注意使用了 `function` 定义了函数）**，而这时的 `this` 为方法调用的对象 `obj2`，因此 `this.a = 200`。

进一步说明这种作用域查找规则的是下面两行，输出是 100. 由于此时 `obj2.b` 的调用是一个普通函数调用，因此 `this` 的值是全局对象，所以输出的是 `window.a` 了。

## Arrow Function 到底是啥

在了解到箭头函数内部的 `this` 其实是一个词法绑定的变量时，我不禁怀疑这个箭头函数究竟是个啥，甚至于它是不是一个函数，有没有自己的作用域？

以前很多对箭头函数的简单解释是「JavaScript 函数的语法糖」，根据前文所述的 `this` 获取值的不同，已经知道箭头函数与普通函数其实有很大的不同，于是尝试一下：

```javascript
var f = () => {};

// 'function'
typeof f;

// true
f instanceof Function;

// true
f.__proto__ === Function.prototype;

// 根据 MDN，箭头函数没有原型：undefined
f.prototype
```

各种证据表明这个箭头函数的确是一个「函数」，只是没有原型对象，因此也就无法作为构造函数调用（`new f()`）。另外 MDN 提到，箭头函数内除了 `this`，还有其他普通函数中常用的变量如 `arguments` 也是词法绑定的，这些变量在箭头函数调用时是沿着作用域链向上查找的。

## 看看规范

[14.2.16 Runtime Semantics: Evaluation](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-arrow-function-definitions-runtime-semantics-evaluation)

里面的 Note 提到箭头函数没有对 `this` 进行 local binding（本地绑定），这些变量的绑定是在 lexically enclosing environment 中进行的，实际上就是包含箭头函数定义的函数执行环境中定义的，这与我们上文的结论一致。
