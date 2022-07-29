# Twikoo Docker Image

Twikoo 私有部署 Docker 镜像。

## 部署指南

### 使用 Okteto 部署

[![Develop on Okteto](https://okteto.com/develop-okteto.svg)](https://cloud.okteto.com/deploy)

### 使用 Docker 部署

1. 安装 Docker，以 Ubuntu 系统为例：

```bash
curl -fsSL https://get.docker.com -o get-docker.sh  # 下载安装脚本
sudo sh get-docker.sh                               # 安装 docker
sudo usermod -aG docker $USER                       # 将当前用户加入 docker 用户组
```

2. 启动 Twikoo：

```bash
docker run -p 8080:8080 -v ${PWD}/data:/app/data -d imaegoo/twikoo
```

默认端口 8080，如果遇到端口冲突问题，请修改命令中的 `8080:8080` 为 `自定义端口:8080`。

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

1. 服务端下载安装 [Node.js](https://nodejs.org/zh-cn/)
2. 安装 Twikoo server: `npm i -g tkserver`
3. 根据需要配置环境变量

| 名称 | 描述 | 默认值 |
| ---- | ---- | ---- |
| `TWIKOO_DATA` | 数据库存储路径 | `./data` |
| `TWIKOO_PORT` | 端口号 | `8080` |
| `TWIKOO_THROTTLE` | IP 请求限流，当同一 IP 短时间内请求次数超过阈值将对该 IP 返回错误 | `250` |

4. 启动 Twikoo server: `tkserver`
5. 访问 `http://服务端IP:8080`
6. 若能正常访问，服务端地址（包含 `http://` 和端口号，例如 `http://12.34.56.78:8080`）即为您的环境 id

### 其他事项

1. Linux 服务器可以用 `nohup tkserver >> tkserver.log 2>&1 &` 命令后台启动
2. 强烈建议配置前置 nginx 服务器并配置 https 证书
3. 数据在服务器上，请注意定期备份数据
