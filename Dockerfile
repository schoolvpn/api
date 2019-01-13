FROM node:latest
LABEL Name=SchoolVPNAPI Version=1
WORKDIR /usr/src/app
COPY ./app .
RUN npm install
CMD [ "npm", "start" ]