FROM node

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json
COPY ./package.json .

RUN npm install

# Copy app source
COPY . .

# TypeScript
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start:watch" ]