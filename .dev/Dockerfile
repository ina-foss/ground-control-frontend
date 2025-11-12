# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy the libs folder containing local dependencies
COPY libs ./libs

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application (static generation)
RUN npm run build

# Stage 2: Build Nginx with VOD module
FROM alpine:3.19 AS nginx-builder

# Install build dependencies
RUN apk add --no-cache \
    gcc \
    libc-dev \
    make \
    openssl-dev \
    pcre-dev \
    zlib-dev \
    linux-headers \
    curl \
    gnupg \
    libxslt-dev \
    gd-dev \
    geoip-dev \
    git

# Set versions
ENV NGINX_VERSION=1.24.0 \
    VOD_MODULE_VERSION=1.33

# Download and extract Nginx
RUN cd /tmp && \
    curl -fSL https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz -o nginx.tar.gz && \
    tar -xzf nginx.tar.gz && \
    rm nginx.tar.gz

# Clone nginx-vod-module
RUN cd /tmp && \
    git clone --branch ${VOD_MODULE_VERSION} https://github.com/kaltura/nginx-vod-module.git

# Build Nginx with VOD module
RUN cd /tmp/nginx-${NGINX_VERSION} && \
    ./configure \
        --prefix=/etc/nginx \
        --sbin-path=/usr/sbin/nginx \
        --modules-path=/usr/lib/nginx/modules \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --pid-path=/var/run/nginx.pid \
        --lock-path=/var/run/nginx.lock \
        --http-client-body-temp-path=/var/cache/nginx/client_temp \
        --http-proxy-temp-path=/var/cache/nginx/proxy_temp \
        --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
        --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
        --http-scgi-temp-path=/var/cache/nginx/scgi_temp \
        --user=nginx \
        --group=nginx \
        --with-http_ssl_module \
        --with-http_realip_module \
        --with-http_addition_module \
        --with-http_sub_module \
        --with-http_dav_module \
        --with-http_flv_module \
        --with-http_mp4_module \
        --with-http_gunzip_module \
        --with-http_gzip_static_module \
        --with-http_random_index_module \
        --with-http_secure_link_module \
        --with-http_stub_status_module \
        --with-http_auth_request_module \
        --with-http_xslt_module=dynamic \
        --with-http_image_filter_module=dynamic \
        --with-http_geoip_module=dynamic \
        --with-threads \
        --with-stream \
        --with-stream_ssl_module \
        --with-stream_ssl_preread_module \
        --with-stream_realip_module \
        --with-stream_geoip_module=dynamic \
        --with-http_slice_module \
        --with-mail \
        --with-mail_ssl_module \
        --with-compat \
        --with-file-aio \
        --with-http_v2_module \
        --add-module=/tmp/nginx-vod-module && \
    make -j$(nproc) && \
    make install

# Stage 3: Final runtime image
FROM alpine:3.19

# Install runtime dependencies
RUN apk add --no-cache \
    pcre \
    openssl \
    zlib \
    libxslt \
    gd \
    geoip \
    ca-certificates

# Copy nginx from builder
COPY --from=nginx-builder /usr/sbin/nginx /usr/sbin/nginx
COPY --from=nginx-builder /etc/nginx /etc/nginx
COPY --from=nginx-builder /usr/lib/nginx /usr/lib/nginx

# Create nginx user and required directories
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx && \
    mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp \
             /var/log/nginx \
             /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx

# Remove default nginx config
RUN rm -f /etc/nginx/nginx.conf

# Copy custom nginx config
COPY .dev/nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Vérifier que les fichiers ont été copiés (ajout pour debug)
RUN ls -la /usr/share/nginx/html/

# Create video directory for VOD content
RUN mkdir -p /usr/share/nginx/html/videos && \
    chown -R nginx:nginx /usr/share/nginx/html/videos

# Forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Expose ports
EXPOSE 80

# Stop signal
STOPSIGNAL SIGQUIT

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
