############# Builder image #############
FROM node:20-stretch as builder

WORKDIR /source.tmp

COPY . .


RUN npm install && \
    npm run build

############# Runner image #############
FROM nginx:1.17.8-alpine

COPY --from=builder /source.tmp/build /var/www 
COPY ./distribution/nginx.conf /etc/nginx/nginx.conf 
COPY ./distribution/config.sh /root/
COPY ./distribution/entrypoint.sh /root/

EXPOSE 80

ENTRYPOINT [ "/root/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
