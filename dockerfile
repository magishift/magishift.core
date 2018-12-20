FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ADD . /usr/src/app/

# Install app dependencies
RUN npm install -g yarn

# install utilities
RUN yarn global add typescript nodemon ts-node
