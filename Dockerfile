FROM node:24-slim AS builder

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG BUILD_CONFIG=production
RUN pnpm build:$BUILD_CONFIG

FROM nginx:alpine AS runner

COPY --from=builder /app/dist/portal-jdav-bayern/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
