# Stage 1: Build ứng dụng
FROM node:18-alpine AS builder

# Tạo thư mục làm việc
WORKDIR /app

# Copy file cấu hình
COPY package*.json ./
COPY rollup.config.mjs ./
COPY tsconfig.json ./
COPY .env ./

# Cài dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build production
RUN npm run build:prod

# Stage 2: Serve với Nginx
FROM nginx:stable-alpine AS production

# Copy file build từ stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy cấu hình Nginx (nếu cần tùy chỉnh)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
