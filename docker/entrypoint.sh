#!/bin/sh
set -e

echo "Running migrations..."
php /var/www/html/artisan migrate --force 2>&1 || echo "Migration failed or already up to date"

echo "Caching config..."
php /var/www/html/artisan config:cache
php /var/www/html/artisan route:cache
php /var/www/html/artisan view:cache

echo "Starting supervisor..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
