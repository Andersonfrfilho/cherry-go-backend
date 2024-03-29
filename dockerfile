FROM node:14

WORKDIR /usr/app

COPY package.json yarn.lock ./

COPY . .

RUN yarn install && \
    yarn build

EXPOSE 3333

CMD ["yarn","run","start:prod"]
