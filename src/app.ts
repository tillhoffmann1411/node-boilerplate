import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { Route } from './interfaces/route.interface';
import Mongo from './config/mongo.config';
import { Passport } from './config/passport.config';
import passport from 'passport';



const PORT = process.env.PORT || 3000;

class App {
  public app: express.Express
  constructor(routes: Route[]) {
    this.app = express();
    this._config();
    this._initRoutes(routes);
  }

  /**
   * add your start ups here like 'db.start()'
   */
  public start(): express.Express {
    Mongo.connect();
    this.app.listen(PORT, () => {
      console.log(`Server is running in http://localhost:${PORT}`)
    });
    return this.app;
  }

  private _initRoutes(routes: Route[]): void {
    console.log('Create Routes:');
    routes.forEach(route => {
      console.log(route.path);
      this.app.use(route.router);
    });
  }

  private _config(): void {
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
      console.log(`${req.method} request to: ${req.originalUrl}`);
      return next();
    });
  }
}

export default App;