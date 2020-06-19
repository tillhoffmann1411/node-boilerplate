FROM node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install
COPY . /usr/src/app
RUN npm run build
EXPOSE 3000
CMD [ "npm", "run", "start:watch" ]