FROM node:alpine

WORKDIR /app/

COPY ./package.json .
RUN yarn
COPY ./server.ts .
COPY ./tsconfig.json .

CMD ["yarn", "run", "server"]

