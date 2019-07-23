FROM node:10.16.0-alpine

WORKDIR /frontend

COPY . /frontend

EXPOSE 5000

RUN npm install

CMD ["npm", "start"]
