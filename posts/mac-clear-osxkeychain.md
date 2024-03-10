---
title: Mac 上清除 git osxkeychain 保存的登录名密码
date: 2018-01-09 09:25:32
tags: [技术]
---

昨天在公司的 Mac 上 clone 项目时报错，提示无法找到项目。在确信地址没错的情况下，就应该是权限不足导致的无法找到项目。

但一般使用 HTTP 协议来进行 clone 时，都会提示输入用户名密码，但奇怪的是这次并没有提示，而是直接报错，因此怀疑是 Mac 上有记录了默认的用户名和密码，且该用户在 Gitlab 上没有这个仓库的权限。

<!-- more -->

```bash
$ git clone http://172.16.18.121/erp/mobileApproval.git
Cloning into 'mobileApproval'...
remote: The project you were looking for could not be found.
fatal: repository 'http://172.16.18.121/erp/mobileApproval.git/' not found
```

## Git 凭证管理

由于平时大多数时候都在使用 SSH 方式连接 Git 仓库，对使用 HTTP 方式的用户名密码管理不是很熟，因此去看了下官方文档，[Git - 凭证管理](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%87%AD%E8%AF%81%E5%AD%98%E5%82%A8)，里面提到了几点：

> 默认所有都不缓存。 每一次连接都会询问你的用户名和密码。
>
> “store” 模式会将凭证用明文的形式存放在磁盘中，并且永不过期。 这意味着除非你修改了你在 Git 服务器上的密码，否则你永远不需要再次输入你的凭证信息。 这种方式的缺点是你的密码是用明文的方式存放在你的 home 目录下。
>
> 如果你使用的是 Mac，Git 还有一种 “osxkeychain” 模式，它会将凭证缓存到你系统用户的钥匙串中。 这种方式将凭证存放在磁盘中，并且永不过期，但是是被加密的，这种加密方式与存放 HTTPS 凭证以及 Safari 的自动填写是相同的。

特别关注永不过期与 Mac 等关键字可以筛选出这几段描述，简单来说就是「可以把你的用户名密码永远存在电脑上」，因此解决这个问题只需要把这个删掉就可以了。

## OSXKeychain

根据官方说明，是通过这个命令设置缓存的

```bash
git config --global credential.helper <mode>
```

模式可能是 `cache` 或者是 `store`，可能还有一些其他数据。当执行完后，其实也就是往 `.gitconfig` 文件添加内容（也有可能是 `.git-credential`），经过一番摸索，发现这些文件都没有什么异常，没有找到任何与账号密码相关的信息。

于是觉得很大可能会是文档提到的 `osxkeychain` 导致的（OS X 有时候就是这么傻）。了解了原因之后就可以去 Google 了，搜一下 git disable credential-helper osxkeychain 这几个关键字很容易找到这篇

[disable git credential-osxkeychain](https://stackoverflow.com/questions/16052602/disable-git-credential-osxkeychain)

按高票回答做了一遍

```bash
# 全部 unset 一遍呗
$ git config --local --unset credential.helper
$ git config --global --unset credential.helper
# 这个要 sudo
$ sudo git config --system --unset credential.helper

# 这三个命令都没有显示任何东西了
$ git config --local credential.helper
$ git config --global credential.helper
$ git config --system credential.helper
```

但发现还是不能成功提示输入用户名密码，继续尝试第二顺位的回答

```bash
# 还真的依然有 osxkeychain
$ git config -l
credential.helper=osxkeychain

# 跟回答一毛一样
$ git config --show-origin --get credential.helper
file:/Applications/Xcode.app/Contents/Developer/usr/share/git-core/gitconfig    osxkeychain
```

好了，终于发现这个用户名密码是哪里搞出来的了，把那个文件里的 `credential` 配置删掉即可重新提示输入用户名密码了。
