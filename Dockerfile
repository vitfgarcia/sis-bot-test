#==========================================================
# @author: Vitor Ferreira Garcia <vitfgarcia@gmail.com>
# @version: 0.1.0
#
# @description: Dockerfile to build app
#==========================================================

FROM node:10.16.2-alpine

WORKDIR /app

COPY src src
COPY ./package.json ./package.json

RUN npm install --production

CMD ["npm", "start"]