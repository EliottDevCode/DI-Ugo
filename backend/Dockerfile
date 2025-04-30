FROM php:8.2-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    acl \
    git \
    bash \
    icu-libs \
    libzip \
    unzip \
    zlib \
    nginx

# PHP Extensions
RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    icu-dev \
    libzip-dev \
    zlib-dev \
    sqlite-dev \
    && docker-php-ext-install -j$(nproc) \
    intl \
    zip \
    pdo \
    pdo_mysql \
    pdo_sqlite \
    && pecl install apcu \
    && docker-php-ext-enable apcu \
    && apk del .build-deps

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/symfony

# Copy project files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/symfony

# Configure Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Create startup script
RUN echo '#!/bin/sh' > /usr/local/bin/start.sh && \
    echo 'php-fpm -D' >> /usr/local/bin/start.sh && \
    echo 'nginx -g "daemon off;"' >> /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]

EXPOSE 8000