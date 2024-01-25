#!/bin/sh

/root/config.sh /var/www/static/js/main.*.js
/root/config.sh /var/www/index.html

exec "$@"

