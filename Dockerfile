FROM node:lts AS build
WORKDIR /app
ENV NODE_ENV production
RUN set -eux; \
  npm install --production tkserver@latest
FROM node:lts-buster-slim
WORKDIR /app
ENV NODE_ENV production
COPY --from=build /app .
EXPOSE 8080
CMD ["/app/node_modules/.bin/tkserver"]
