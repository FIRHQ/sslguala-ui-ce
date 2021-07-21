# 选择基础镜像
FROM node:14
# 设置工作目录
WORKDIR /sslguala-ui-ce
ADD . /sslguala-ui-ce
# 在镜像中下载前端依赖
RUN npm install
# 执行构建
RUN npm run build
