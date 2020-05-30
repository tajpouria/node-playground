FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .

RUN yarn

COPY ./index.js .

EXPOSE 8080

CMD ["node", "./index.js"]

