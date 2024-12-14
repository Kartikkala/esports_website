FROM node:20-bullseye

RUN apt update

RUN apt upgrade -y

ARG MONGO_CONNECTION_STRING

ENV MONGO_CONNECTION_STRING=${MONGO_CONNECTION_STRING}

ENV USER_EMAIL_PASSWORD=${USER_EMAIL_PASSWORD}

COPY . .

RUN npm ci

EXPOSE 80

CMD ["node", "out/app.js"]