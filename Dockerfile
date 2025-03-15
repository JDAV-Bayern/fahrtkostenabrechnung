FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG BUILD_CONFIG=production
RUN ng build -- --configuration $BUILD_CONFIG

FROM nginx:alpine AS runner

COPY --from=builder /usr/src/app/dist/portal-jdav-bayern/browser/de /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
