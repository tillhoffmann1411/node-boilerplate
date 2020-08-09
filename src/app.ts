import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import https from 'https';
import fs from 'fs';
import path from 'path';

import { Route } from './interfaces/route.interface';
import Mongo from './config/mongo.config';
import { Passport } from './config/passport.config';


const PORT = process.env.PORT || 3000;

class App {
  public app: express.Express
  private _httpsCredentials: {key: Buffer, cert: Buffer};
  
  constructor(routes: Route[]) {
    this._httpsCredentials = this._getHttpsCredentials();
    this.app = express();
    this._setupMiddlewares();
    this._initRoutes(routes);
  }

  /**
   * add your start ups here like 'db.start()'
   */
  public start(): express.Express {
    Mongo.connect();
    if (this._httpsCredentials.key && this._httpsCredentials.cert) {
      https.createServer({
        key: this._httpsCredentials.key,
        cert: this._httpsCredentials.cert,
      }, this.app).listen(PORT, () => {
        console.log(`Server is running in https://localhost:${PORT}`)
      })
    } else {
      this.app.listen(PORT, () => {
        console.log(`Server is running in http://localhost:${PORT}`)
      });
    }
    return this.app;
  }

  private _initRoutes(routes: Route[]): void {
    console.log('Create Routes:');
    routes.forEach(route => {
      console.log(route.path);
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
      console.log(`${req.method} request to: ${req.originalUrl}`);
      return next();
    });
  }

  private _getHttpsCredentials(): {key: Buffer, cert: Buffer} {
    const key = fs.readFileSync(path.join(__dirname, '..','cert', 'server.key'));
    const cert = fs.readFileSync(path.join(__dirname, '..', 'cert', 'server.cert'));
    return {key, cert};
  }
}

export default App;