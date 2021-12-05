import cookieParser from 'cookie-parser';
import express, { Express, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import morgan, { StreamOptions } from "morgan";
import * as path from "path";
import { Constants } from "../shared/constants";
import { Logger } from "./config/logger";
import router from './routes';
import REQUEST_JOIN_ROOM = Constants.REQUEST_JOIN_ROOM;

export const newInstance = () => {
  const app = express();
  attachRateLimiter(app);
  setupViewEngine(app);
  attachMiddleware(app);

  return app;
};

function setupViewEngine(app: Express) {
  app.set('views', path.join(__dirname, '../client/views'));
  app.set('view engine', 'ejs');
}

function attachMiddleware(app: Express) {
  app.use(LOGGER)
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use('/', express.static(path.join(__dirname, '../client/public')));
  app.use('/shared', express.static(path.join(__dirname, '../shared')));
  app.use('/javascript', express.static(path.join(__dirname, '../client/javascript')));
  app.use('/', express.static(path.join(__dirname, '../client/node_modules')));
  app.use(router);
  app.use(errorHandler);
}

function attachRateLimiter(app: Express) {
  app.use(REQUEST_JOIN_ROOM + ':room_code', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
  }));
}

function errorHandler(err, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

const LOGGER = morgan('combined', {
  stream: <StreamOptions>{
    write(str: string): void {
      if (!process.env.DEV) {
        Logger.info(str); //Using winston for production
      } else {
        console.log(str);
      }
    },
  },
})
