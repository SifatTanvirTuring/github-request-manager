FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
ENV DEBIAN_FRONTEND=noninteractive
RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT ["entrypoint.sh"]