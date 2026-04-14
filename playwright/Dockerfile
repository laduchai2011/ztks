# Sử dụng Node.js 18 dựa trên Ubuntu
# FROM node:18-bullseye
FROM node:20-bookworm

# Base image Playwright
# FROM mcr.microsoft.com/playwright:v1.50.0-jammy

WORKDIR /app

RUN apt-get update && apt-get install -y \
  wget ca-certificates fonts-liberation \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libxkbcommon0 libxcomposite1 \
  libxdamage1 libxfixes3 libxrandr2 \
  libgbm1 libasound2 libpangocairo-1.0-0 \
  libpango-1.0-0 libgtk-3-0 \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

# ⚠️ BẮT BUỘC
RUN npx playwright install --with-deps

COPY . .

RUN npm run build

# Chạy Playwright
CMD ["node", "dist/index.js"]