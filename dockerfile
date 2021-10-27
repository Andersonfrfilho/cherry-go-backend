FROM node

WORKDIR /usr/app

COPY package.json yarn.lock ./

COPY . .

RUN yarn install --frozen-lockfile && \
    yarn build

EXPOSE 3333

CMD ["yarn","run","start:prod"]
