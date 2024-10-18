# 开始
```sh
# 安装依赖
npm i

# 启动开发环境
npm run dev

# 打包
npm run build
```
# docker Nginx配置
    注意参数和路由
# https
```sh
server {
    listen 80;
    server_name xxxxxx.com xxxx.com;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name  xxxxxx.com xxxx.com;
    ssl_certificate /usr/share/nginx/html/ssl/xxx.crt;
    ssl_certificate_key /usr/share/nginx/html/ssl/xxxxxx.key;
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 5m;
    gzip on;
    gzip_comp_level 5;          # 压缩级别（1-9），级别越高，压缩越多，但 CPU 使用率也更高
    gzip_min_length 256;        # 最小压缩文件大小（字节）
    gzip_buffers 16 8k;         # 缓冲区大小
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_proxied any;           # 允许压缩代理请求的响应
    gzip_vary on;               # 在响应头中添加 `Vary: Accept-Encoding`

    location / {
        root   /usr/share/nginx/html/imai-h5;
        index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```
