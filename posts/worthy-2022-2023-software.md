---
title: 2022/2023 おすすめ：软件篇
date: 2023-01-19 16:40:00
tags: [效率, 软件]
---

# 2022/2023 おすすめ：软件篇

总结 2022 并展望 2023 我觉得很好用的苹果生态的软件。排名不分先后。

## Raycast

官网：[Raycast](https://www.raycast.com/)

迭代了一波，到了 2022 底终于可以替换掉 Alfred 了，毕竟也不想一直用盗版软件。其实我对 Alfred 的依赖主要在于他的剪贴板历史和 Snippets. Raycast 已经支持得很好了。更不用说 Raycast 的 UI 做得比 Alfred 现代多了，颜值也是很重要的嘛。

![](https://static.ryancui.com/images/20230119172146_raaZz0_Screenshot.jpeg)

另外，Raycast 的 Snippets 居然是支持输入 keyword 直接替换成对应的 snippet 的。比如我设定了某个片段的 keyword 是 ldap, 那当我在任何输入区域输入 ldap 的时候，都会自动变成对应的片段，连我自动唤起 snippet 都省了，简直是太方便了。

## 1Password

官网：[1Password](https://1password.com/)

大名鼎鼎的密码管理工具，今年开始用起来了，开了一个 Family 的套餐，不算贵，把所有杂七杂八的账号密码都丢进去管理，的确很好。除了网站密码，所有与 secret 相关的东西都能存进去，银行卡信用卡、服务器密钥、API AccessToken 等等

![](https://static.ryancui.com/images/20230119171756_ma00T4_Screenshot.jpeg)

目前有两个比较大的不爽，一个是日常开发用的各种 localhost 和内网地址的密码不知道要怎么管理，放进去感觉有点怪怪的，不放进去嘛又不是很方便，还得想想怎么解决。另一个是国内的大多数手机软件（尤其是各大银行软件），在输入密码的时候基本都是自己搞了个虚拟键盘来输入，完全用不了 iOS Password 的 AutoFill 功能，1Password 完全沦为一个单纯的记事本，实在是太可惜了。

## Notion

官网：[Notion](https://www.notion.so/)

只能说，强力推荐！这是一个免费软件！

最近跟老婆搞了一个家庭的 Page, 可以大家一起编辑一起查看，记录一些家庭相关的事项。原来是打算搞一个 team space，但发现 share workspace 的话是要收费的，但是呢，可以对单独的一个 Page 把对方以 guest 的角色邀请进来，而且整个 Page 树下面都是 unlimited block 和可编辑的！（那不就等于 share workspace 了吗？）guest 的数量对免费版本来说是有限的，所以比较适合一两个人协同的场景。看着一个 Team space 的慢慢完善，还是挺有意思的。

![](https://static.ryancui.com/images/20230119174127_YaiX2q_2023-01-19_17-40-42.jpeg)

## Notes

尝试过这么多的笔记软件后，还是苹果的备忘录是最好用的。如果你是苹果全家桶用户，相信我，你最终还是会回到备忘录的怀抱里，还不如从一开始就不要花时间在挑选工具上。

另外自从有了家庭，共享就是一个很刚性的需求。在 MacOS 上是没办法共享一个文件夹的，必须要在 iOS 上操作才行，一旦共享了之后整个文件夹树都会被共享（跟 Notion 一样）。需要共同查看编辑的都放到这个文件夹下面就可以了，也很方便，比较适合做一些简单的事项共享。实际上我们两个人都深度使用苹果自带的三件套(Calendar, Notes, Reminder)，之前试过其他或轻或重的替代方案，诸如 Google 日历、Omni 系列、各种笔记软件等，最终还是觉得，内置的应用是最香的。

## newsletter

自从之前 Twitter 账号被冻结之后，两三年没上过推，申请解冻成功后，最近就刷到了这篇[《我获取信息的方法 2022 版》](https://geekplux.com/posts/the-ways-to-get-information-2022)。尝试了一下里面提到的 newsletter, 确实有点好用，在 2023 会尝试一下通过这种方式来获取信息。（顺便学习一下邮箱/邮件应该要怎么使用...）

这里顺便提一下 MacOS 下的邮箱客户端，折腾了半天，最终还是选择直接用 Gmail 的 Web 端。由于众所周知的原因，Mac 本地的软件要走代理才能访问 gmail, 这样又不能通过 ssr 来做系统代理，又要跑去换 Clash, 搞了一天最后啥都没搞成。折腾这些玩意确实没啥价值，希望大家引以为鉴。

## Arc

官网：[Arc](https://arc.net/)

传说中的要改变 Internet 的网红浏览器。网上其实有一大堆的评测，实际试用下来并没有太多的惊喜，但是确实非常好看，十分适合用来装模作样。我的主力依然是从大学时代就陪伴至今的 Chrome.（哎其实 Windows XP 年代的 Chrome 也很好看啊）。

想要邀请码尝尝鲜的可以联系我。

![](https://static.ryancui.com/images/20230119172418_Hs77X3_Screenshot.jpeg)

## ClashX Pro

增强模式加允许局域网连接，可以让电脑变成其他设备的代理，这里的想象空间就很大了，比如我就用这种方式将 Apple TV 变废为宝。不过在主力机上用貌似有各种奇奇怪怪的问题，可能是 fake ip 导致我的本地 DNS 全部失效，各种内网的地址都访问不了。所以现在这台 mbp 还是用回了 ssr, 懒得折腾具体的原因了。

## Scroll Reverser

官网：[Scroll Reverser](https://pilotmoon.com/scrollreverser/)

如果既需要使用触控板又使用鼠标（比如说外接显示器合盖使用要用鼠标、拿起来要用触控板），触控板和鼠标的滚动方向是相反的（因为习惯了 Windows 下鼠标滚轮的行为），每次切换的时候都要去设置改一下滚动行为，十分麻烦。这个软件可以分别控制触控板和鼠标的滚动方向，设置好了就一劳永逸了。不知道为什么 Mac 没有内置这个功能。

![](https://static.ryancui.com/images/20230119182410_huGLla_Screenshot.jpeg)

## Excalidraw

官网：[Excalidraw](https://excalidraw.com/)

很有意思的画图工具，适合画各种奇奇怪怪的富有创意的技术洞察。唯一的缺点是中文很丑。这里放一张前端相关的，颇有道理。

![](https://static.ryancui.com/images/20230119185201_HgVpif_DCIM.jpeg)

## 点名表扬

- JetBrains: 教育 license 没了我就会付费
- VS Code: Mac 下最好用的 NotePad++
- iTerm: 没有更好的替代品了
- Magnet: 纯粹是习惯了
- IINA & VLC: 没有更好的替代品了

## 点名批评

- Fleet: 等了 n 久的 preview, 就这？
- 无边记：我感觉就是来搞笑的，也可能是我不会用
- Typora: 出于情怀好像是花了 89 买了正版，但他的位置已经被 VS Code 占据了
