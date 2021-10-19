FROM node:lts AS build
WORKDIR /app
ENV NODE_ENV production
RUN set -eux; \
  npm config set registry https://registry.npm.taobao.org; \
  npm install --production --silent twikoo-vercel@1.4.9
COPY index.js .
FROM node:lts-buster-slim
WORKDIR /app
ENV NODE_ENV production
COPY --from=build /app .
EXPOSE 8080
CMD ["node", "index.js"]
