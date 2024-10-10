FROM node:20.18-alpine3.20
WORKDIR /app
COPY package*.json .
COPY . .
RUN apk add --no-cache python3 g++ make
RUN yarn
CMD [ "yarn", "start:dev" ]

EXPOSE 3000
