import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { Route } from './interfaces/route.interface';
import Mongo from './config/mongo.config';
import { Passport } from './config/passport.config';


const PORT = process.env.PORT;

class App {
  public app: express.Express
  
  constructor(routes: Route[]) {
    this.app = express();
    this._setupMiddlewares();
    this._initRoutes(routes);
  }

  /**
   * add your start ups here like 'db.start()'
   */
  public start(): express.Express {
    Mongo.connect();
    this.app.listen(3000, () => {
      console.info('\x1b[32m', `Server is running in http://localhost:${PORT}`)
    });
    return this.app;
  }

  private _initRoutes(routes: Route[]): void {
    console.info('Create Routes:');
    routes.forEach(route => {
      console.info('\x1b[36m', route.path);
      this.app.use(route.router);
    });
  }

  private _setupMiddlewares(): void {
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(express.json());
    this.app.use(cookieParser(process.env.COOKIE_SECRET));
    this.app.use(Passport.init());
    this.app.use(cors({
      origin: 'http://localhost:4200',
      credentials: true,
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }));
    this.app.use((req, res, next) => {
      console.info('\x1b[32m', req.method, '\x1b[37m', `request to: ${req.originalUrl}`);
      return next();
    });
  }
}

export default App;