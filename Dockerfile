FROM node:alpine

WORKDIR /app

COPY package.json /app
RUN yarn install

COPY . /app

RUN yarn build

EXPOSE 3000

CMD ["node", "./bin/www"]
