# Bước 1: Sử dụng Node.js để build ứng dụng
FROM node:20.16 AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY tuneBox-Front-end/package.json ./
COPY tuneBox-Front-end/package-lock.json ./

# Cài đặt các dependency
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY tuneBox-Front-end/ ./

# Build ứng dụng React (Sử dụng build thay vì dev)
RUN npm run build

# Bước 2: Sử dụng Nginx để phục vụ ứng dụng React
FROM nginx:1.21-alpine

# Sao chép các file build từ bước 1 vào thư mục của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Cấu hình Nginx (sao chép nginx.conf từ thư mục React-TuneBox vào container)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose cổng 80 để container lắng nghe
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
