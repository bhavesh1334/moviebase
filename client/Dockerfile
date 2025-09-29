FROM node:22-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 8000
CMD [ "npm","run","start","--","-p","8000" ]