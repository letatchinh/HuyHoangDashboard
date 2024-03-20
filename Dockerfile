############# Builder image #############
FROM node:16 as builder

WORKDIR /source.tmp

COPY . .
RUN apt-get update && apt-get install -y git

RUN npm install


FROM node:16

WORKDIR /opt/worldpharmavn/dashboard

COPY --from=builder /source.tmp .

EXPOSE 3000

CMD [ "npm", "start" ]
