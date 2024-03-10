---
title: 本地 localhost 域名添加 HTTPS 证书
date: 2021-12-16 17:13:21
tags: [技术]
---

本文介绍如何对本地的 localhost 域名添加 HTTPS 证书，方便本地开发调试。

<!-- more -->

在网上看到的教程，但里面有些坑，这里重新记录一下。

参考：https://devnote.pro/posts/10000050311000

## 创建根 CA

```bash
openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout RootCA.key -out RootCA.pem -subj "/C=US/CN=Example-Root-CA"

openssl x509 -outform pem -in RootCA.pem -out RootCA.crt
```

## 创建证书

首先要建一个 `domains.ext` 列出所有你需要加 https 的域名，这一步不能省。因为 Chrome 开了一个叫什么 subjectAltName 的校验，这一步省了 Chrome 就不认你的证书。

下面的 DNS 可以根据你自己的需要加 DNS.2 .3 .4 反正都是用同一个证书的。

```
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
```

生成证书。这里有个坑，原文章的命令 `-days` 参数是 1024. 然而从 2020/09/01 开始，Chrome 将不再信任有效期大于 398 天的证书，因此这里的 days 参数要设成 398 以下。其他一样。

```bash
openssl req -new -nodes -newkey rsa:2048 -keyout localhost.key -out localhost.csr -subj "/C=CN/ST=Guandong/L=Shenzhen/O=Example-Certificates/CN=localhost.local"

openssl x509 -req -sha256 -days 390 -in localhost.csr -CA RootCA.pem -CAkey RootCA.key -CAcreateserial -extfile domains.ext -out localhost.crt
```

## 信任本地 RootCA

这里参考原文章的描述即可。Mac 下直接双击打开之前生成的 RootCA.crt 就会打开 Mac 的钥匙串应用。调整为始终信任即可。

![](https://static.ryancui.com/images/20220317150421_NCDLrX_Screenshot.png)
