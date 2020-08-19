# node-boilerplate
A boilerplate template for NodeJS projects.

## Setup
1. Create a **.env** file in the root directory with following settings:
```
  PORT=80

  MONGO_USERNAME=
  MONGO_PASSWORD=
  MONGO_PORT=27017
  MONGO_DB=mongodb

  JWT_KEY=
  COOKIE_SECRET=  
```
2. With `docker-compose up` you can start the server.
3. Test your running backend [Postman API documentation](https://documenter.getpostman.com/view/12313948/T1LJkUHc)

## What belongs where

| Folder          | Contains                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------- |
| **config**      | Configurations for packages.                                                                       |
| **controllers** | Logic behind the routes but delegate the main logic to **services**. Handle here errors.           |
| **interfaces**  | Implement your typescript interfaces here.                                                         |
| **middleware**  | Express middlewares are here implemented.                                                          |
| **models**      | Mongoose models are here defined                                                                   |
| **routes**      | Define your different routes here.                                                                 |
| **services**    | Main logic divided according to the data they use. This is where database accesses take place.     |



Feel free to use [commit emojis](https://gitmoji.carloscuesta.me/) for some color and easy to understand commit messages.
