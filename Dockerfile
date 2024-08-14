# Sử dụng image cơ sở cho Node.js
FROM node:14

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép mã nguồn vào container
COPY . .

# Cấu hình môi trường
ENV POSTGRES_USER=${POSTGRES_USER:-pg}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-pg}
ENV POSTGRES_DB=${POSTGRES_DB:-mydb}
ENV POSTGRES_HOST=${POSTGRES_HOST:-localhost}
ENV POSTGRES_PORT=${POSTGRES_PORT:-5432}

# Mở cổng ứng dụng
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]
