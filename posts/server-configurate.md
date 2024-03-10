---
title: 服务器由零配置
date: 2017-12-06 14:55:31
tags: [技术]
---

一直都在用 Vultr 的服务器，但是网速真的太特么慢了，100+ 毫秒的 ping，经常连 4G 都访问不了，做做实验还行，有应用部署在上面就完全用不了。所以最后还是选择了国内大哥阿里云（尼玛贵了一倍有多

<!-- more -->

那么又要重新在上面部署安装各种环境、软件了，这里记录一下，防止以后又要再迁移。

本文使用的服务器为 CentOS 7.4，需要配置的环境包括：

- MySQL，远程访问 / 中文编码
- Nginx，配置 https / http2 / 开启gzip / SPA 支持 / 代理 RESTFul 路由
- Node.js
- Git

## MySQL

### 查看 CentOS 版本

```
$ cat /etc/redhat-release
CentOS Linux release 7.4.1708 (Core)
```

### 配置 Yum 源

```
$ curl -LO http://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm

$ sudo yum localinstall mysql57-community-release-el7-11.noarch.rpm

# 检查是否安装成功
$ sudo yum repolist enabled | grep "mysql.*-community.*"
mysql-connectors-community/x86_64 MySQL Connectors Community                42
mysql-tools-community/x86_64      MySQL Tools Community                     55
mysql57-community/x86_64          MySQL 5.7 Community Server               227
```

### 安装

```
$ sudo yum install mysql-community-server
```

### 启动服务并查看服务状态

```
$ sudo systemctl enable mysqld

$ sudo systemctl start mysqld

$ sudo systemctl status mysqld
```

### 修改 root 密码并设置允许远程访问

MySQL 5.7 启动后，在 `/var/log/mysqld.log` 文件中给 root 生成了一个默认密码。通过下面的方式找到 root 默认密码，然后登录 mysql 进行修改：

```
$ grep 'temporary password' /var/log/mysqld.log
[Note] A temporary password is generated for root@localhost: **********

$ mysql -u root -p
Enter password: 
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '<新密码>';

mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '<新密码>';
```

> 这里注意 MySQL 有相应的密码策略，不允许设置一些强度较低的密码，一般来说有大小写字母与数字字母即可通过校验。若要取消限制可参考

### 配置默认编码为 UTF-8mb4

在配置文件中的对应位置，加上以下配置。（默认引擎使用 InnoDB 可以去掉，看实际需求）

```
$ vi /etc/my.cnf
[mysqld]
character_set_server=utf8mb4
collation-server=utf8mb4_unicode_ci
default-storage-engine=INNODB

[client]
default-character-set=utf8
```

重启服务

```
$ sudo systemctl restart mysqld
```

登录 MySQL 查看设置是否成功。

```
mysql> SHOW VARIABLES LIKE 'character%';
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | utf8                       |
| character_set_connection | utf8                       |
| character_set_database   | utf8mb4                    |
| character_set_filesystem | binary                     |
| character_set_results    | utf8                       |
| character_set_server     | utf8mb4                    |
| character_set_system     | utf8                       |
| character_sets_dir       | /usr/share/mysql/charsets/ |
+--------------------------+----------------------------+
8 rows in set (0.22 sec)
```

### 开启端口

如果启用了防火墙，需要开启端口。

```
$ sudo firewall-cmd --zone=public --add-port=3306/tcp --permanent

$ sudo firewall-cmd --reload
```

> 如果使用阿里云的话，还需要在管理控制台配置安全组，在公网入方向开放 3306 端口，否则外网无法远程连接到 MySQL 上

## Nginx

之前在 Vultr 上装的 Nginx 不能开 HTTP2，因为 OpenSSL 的版本不对，要源码编译安装用 1.0.2 的 openssl. 但现在 CentOS 7.4 已经用上了最新的 openssl 了，所以直接用 yum 装就可以支持 http2 了！

```
$ yum install nginx

$ nginx
```

装好之后马上启动，就能访问了，这样安装的默认配置为

- Nginx 配置文件：`/etc/nginx`
- Nginx Web 根目录：`/usr/share/nginx/html`

然后有几件事要搞定：HTTPS、gzip、单页路由配置、API 代理

### HTTPS/HTTP2

这里应该是包括了 HTTP2 的，但是最新版的 nginx 的 https 模块是默认开启了 h2 的，所以只需要开启 https 就可以了。

https 需要证书认证，免费证书非 Let‘s encrypt 最好用了，配合 certbot 工具，拿到一个证书易如反掌。

#### 获取 Certbot 客户端

```
$ wget https://dl.eff.org/certbot-auto

$ chmod a+x ./certbot-auto

$./certbot-auto --help
```

#### 验证域名，并配置 nginx 使用证书

在 nginx 的配置文件 server 中添加下列配置，为了通过 Let's Encrypt 的验证

```
location ^~ /.well-known/acme-challenge/ {
   default_type "text/plain";
   root     /usr/share/nginx/html;
}

location = /.well-known/acme-challenge/ {
   return 404;
}
```

测试配置文件是否有效，重启 nginx

```
$ nginx -t

$ nginx -s reload
```

生成证书，最后换成需要进行认证的域名

```
$ ./certbot-auto certonly --webroot -w /usr/share/nginx/html -d imtouch.info
```

成功后，在 nginx 的配置文件中添加，注意 `ssl_certificate`/`ssl_certificate_key` 的路径正确

```
server {
  listen       443 ssl http2 default_server;
  listen       [::]:443 ssl http2 default_server;
  server_name  imtouch.info;
  root         /usr/share/nginx/html;

  ssl_certificate "/etc/letsencrypt/live/imtouch.info/fullchain.pem";
  ssl_certificate_key "/etc/letsencrypt/live/imtouch.info/privkey.pem";
  ssl_session_cache shared:SSL:1m;
  ssl_session_timeout  10m;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;
}
```

再次确认配置文件正确，重启 nginx 即可

```
$ nginx -t

$ nginx -s reload
```

> 证书与域名是一一对应的，当需要使用二级域名时，需要再按这个流程申请一个新的证书

#### 自动更新证书

测试一下更新，这一步没有在真的更新，只是在调用 Certbot 进行测试

```
$ ./certbot-auto renew --dry-run
```

看到成功之后就可以配置自动更新了

```
# 手动更新
$ ./certbot-auto renew -v

$ ./certbot-auto renew --quiet --no-self-upgrade
```

### 开启 gzip

在 `/etc/nginx/nginx.conf` 的 `server` 域加入以下语句

> 注意 JavaScript 的资源有可能 content-type 是 application/javascript，漏了这个一直没压缩 js

```bash
gzip on;
gzip_min_length 1k;
gzip_buffers 4 16k;
gzip_comp_level 5;
gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/javascript;
```

### 单页路由设置

当我们部署了单页应用在 nginx 上时（如 Vue、Angular 等），如果应用的前端路由是使用 HTML5 新的 history API 来做路由（就是地址栏看不到 #，不是用的 Hash），当用户刷新页面的时候，会由于直接找到 nginx 对应的 Web 目录而报 404。因此需要设置 nginx 当找不到文件时，定位回 index.html.

```
location /fastfood/ {
  try_files $uri $uri/ /fastfood/index.html;
}
```

`try_files` 会检查文件是否存在，不存在就跳转至应用所在的 `index.html`

### API 代理

使用 nginx 可以代理开放在内部端口的 API 后端应用，这样就不用处理跨域的问题，而且安全性更好

```
location ^~ /fastfood/api/ {
   rewrite ^/fastfood/api/(.*) /fastfood/api/$1 break;
   proxy_http_version 1.1;
   proxy_set_header X-Real-IP $remote_addr;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   proxy_set_header Host $http_host;
   proxy_set_header X-NginX-Proxy true;
   proxy_set_header Upgrade $http_upgrade;
   proxy_set_header Connection "upgrade";
   proxy_pass http://127.0.0.1:8360/;
   proxy_redirect off;
}
```

将所有 `/fastfood/api` 的请求代理到后端的 8360 端口。

## Node.js

按官网说明，直接用 yum 安装即可。

```
$ curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -

$ sudo yum -y install nodejs

$ node -v

$ npm -v
```

## Git

直接使用 `yum install git` 安装即可。

## 参考资料

1. [CentOS 7 下 Yum 安装 MySQL 5.7](http://qizhanming.com/blog/2017/05/10/centos-7-yum-install-mysql-57)
2. [HTTPS 简介及使用官方工具 Certbot 配置 Let’s Encrypt SSL 安全证书详细教程](https://linuxstory.org/deploy-lets-encrypt-ssl-certificate-with-certbot/)
3. [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/)

