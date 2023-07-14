FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS backend
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm i pm2 -g \
&& npm ci ---omit=dev \
&& npm i @nestjs/config
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js

EXPOSE 4000
CMD [ "pm2-runtime", "start", "ecosystem.config.js"]