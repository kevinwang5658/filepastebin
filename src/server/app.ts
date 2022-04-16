import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import createError from 'http-errors';
import path from 'path';
import { Constants } from './constants';
import router from './routes';
import REQUEST_JOIN_ROOM = Constants.REQUEST_JOIN_ROOM;


export const newInstance = () => {
  const app = express();
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
  });

  // view engine setup
  app.set('views', path.join(__dirname, '../client/views'));
  app.set('view engine', 'ejs');

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/', express.static(path.join(__dirname, '../client/public')));
  app.use('/shared', express.static(path.join(__dirname, '../shared')));
  app.use('/javascript', express.static(path.join(__dirname, '../client/javascript')));
  app.use(REQUEST_JOIN_ROOM + ':room_code', limiter);
  app.use(router);
  app.use(defaultToError);
  app.use(handleErrors);

  return app;
};

function defaultToError(req: Request, res: Response, next: NextFunction): void {
  next(createError(404));
}

function handleErrors(err: any, req: Request, res: Response): void {
  console.error(err.message);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}
