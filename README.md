# Twikoo Docker Image

Twikoo 私有部署 Docker 镜像。

WARNING: 私有部署不是 Twikoo 推荐的部署方式，**请自行申请域名、证书**，并承担包括但不限于低性能、数据丢失等风险。

## 部署指南

### 使用 Docker 部署

1. 安装 Docker，以 Ubuntu 系统为例：

```bash
curl -fsSL https://get.docker.com -o get-docker.sh  # 下载安装脚本
sudo sh get-docker.sh                               # 安装 docker
sudo apt-get install docker-compose                 # 安装 docker-compose
sudo usermod -aG docker $USER                       # 将当前用户加入 docker 用户组
```

2. 安装 Twikoo：

```bash
mkdir twikoo          # 创建 twikoo 目录
cd twikoo             # 进入 twikoo 目录
mkdir data            # 创建数据库目录
curl -O https://cdn.jsdelivr.net/gh/imaegoo/twikoo-docker/docker-compose.yml
                      # 下载 docker-compose.yml
docker-compose up -d  # 启动 twikoo
```

默认端口 8080，如果遇到端口冲突问题，请修改 docker-compose.yml 中的端口。

3. 测试 Twikoo：

```bash
curl http://localhost:8080/
```

如果您看到类似 “Twikoo 云函数运行正常” 的提示，那么 Twikoo 已经部署成功。

4. 配置前置 Nginx 服务器或负载网关，以通过 HTTPS 访问 Twikoo，如下 Nginx 配置可供参考，过程略。

```txt
# ......
http {
    # ......
    server {
        listen       80;
        listen       [::]:80;
        return       301 https://$server_name$request_uri;
    }
    server {
        listen       443 ssl;
        listen       [::]:443 ssl;
        ssl_certificate      cert/fullchain.pem;
        ssl_certificate_key  cert/privkey.pem;
        location / {
            proxy_pass   http://127.0.0.1:8080;
        }
    }
}
```

### 不使用 Docker 部署

1. 安装 Node.js 运行环境，版本号不低于 12.x；

2. 安装 MongoDB 服务端；

3. 安装 Twikoo：

```bash
mkdir twikoo                # 创建 twikoo 目录
cd twikoo                   # 进入 twikoo 目录
npm install twikoo-vercel   # 安装 twikoo-vercel
curl -O https://cdn.jsdelivr.net/gh/imaegoo/twikoo-docker/index.js
                            # 下载 index.js
export MONGODB_URI=mongodb://数据库用户名:数据库密码@localhost:27017/
                            # 配置环境变量
node index.js               # 启动 twikoo
```

默认端口 8080，如果遇到端口冲突问题，请修改 index.js 中的端口。

3. 测试 Twikoo：

```bash
curl http://localhost:8080/
```

如果您看到类似 “Twikoo 云函数运行正常” 的提示，那么 Twikoo 已经部署成功。

4. 配置前置 Nginx 服务器或负载网关，以通过 HTTPS 访问 Twikoo，过程略。

## 待办项

- [x] mongo 数据不能放容器里，怎么映射到物理盘上
- [ ] https 证书怎么申请，能不能在容器内自动申请
- [ ] serverless 天生无状态，但只有一个节点的情况下，要做并发请求隔离
- [ ] 文档教程
