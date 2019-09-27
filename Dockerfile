FROM node:10.16.0-alpine

WORKDIR /frontend

COPY . /frontend

EXPOSE 8000

RUN npm install

CMD ["npm", "start"]
