FROM node:16-alpine

RUN apk add g++ make py3-pip

RUN npm install -g serve

WORKDIR /app

COPY package*.json ./

RUN node -v

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8081
CMD [ "npm", "run", "serve:prod" ]