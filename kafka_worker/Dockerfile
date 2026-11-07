# Sử dụng Node.js 18 dựa trên Ubuntu
FROM node:18-bullseye

# Cài ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài build tools & ODBC runtime
RUN apt-get update && apt-get install -y python3 make g++ unixodbc-dev curl gnupg && rm -rf /var/lib/apt/lists/*

# Cài Microsoft ODBC driver
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql18 && rm -rf /var/lib/apt/lists/*

# Sao chép package.json trước để tận dụng cache Docker
COPY package*.json ./

ENV NODE_OPTIONS="--max-old-space-size=1024"

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build TypeScript sang JavaScript
RUN npm run build

# Mở port (nếu app chạy trên 3000)
EXPOSE 4000

# Chạy ứng dụng
# CMD ["node", "dist/src/index.js"]
CMD ["node", "dist/index.js"]
