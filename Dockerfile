FROM node:8

# Create app directory
WORKDIR /usr/src/app

ENV HOST 0.0.0.0
EXPOSE 3333
CMD [ "npm", "start" ]
