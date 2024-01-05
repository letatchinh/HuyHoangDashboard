#!/bin/sh

/root/config.sh /var/www/static/js/main.*.chunk.js
/root/config.sh /var/www/index.html
/root/config.sh /var/www/firebase-messaging-sw.js

exec "$@"

