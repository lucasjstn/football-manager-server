FROM node:20.18-alpine3.20
WORKDIR /app
COPY yarn.lock package.json ./
COPY . .
RUN yarn install --ignore-engines
CMD [ "yarn", "start:dev" ]

EXPOSE 3001
