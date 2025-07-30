FROM node:21-slim
WORKDIR /home/user

COPY package.json .

COPY benchmark_runner.mjs .

RUN npm install -g prettier
