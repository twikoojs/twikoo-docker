FROM node:lts AS build
WORKDIR /app
ENV NODE_ENV production
RUN set -eux; \
  npm install --production twikoo-vercel@1.4.11
COPY index.js .
FROM node:lts-buster-slim
WORKDIR /app
ENV NODE_ENV production
COPY --from=build /app .
EXPOSE 8080
CMD ["node", "index.js"]
