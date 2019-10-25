FROM node:latest

WORKDIR /app

COPY . .

RUN ls -ltrah

RUN apt-get update && \
    apt-get install -y

RUN npm install
RUN npm install @angular/cli
RUN npm install typescript@">=3.4.0 <3.6.0"

ENTRYPOINT ["npm", "start"]