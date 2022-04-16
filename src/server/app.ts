import express, { Express, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import * as http from 'http';
import createError from 'http-errors';
import morgan from 'morgan';
import path from 'path';
import SocketIO from 'socket.io';
import router from './routes';
import { socketIORouter } from './routes/socket';

export function newExpressInstance(): Express {
  const app = express();

  app.set('views', path.join(__dirname, '../client/views'));
  app.set('view engine', 'ejs');
  attachMiddleware(app);

  return app;
}

export function newSocketIOInstance(server: http.Server): SocketIO.Server {
  const socketIOServer = SocketIO(server, {
    pingTimeout: 30000,
  });
  socketIOServer.use(wrap(morgan('combined')));
  socketIOServer.on('connect', socketIORouter);
  return socketIOServer;
}

function attachMiddleware(app: Express): void {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan('combined'));
  app.use('/', express.static(path.join(__dirname, '../client/public')));
  app.use('/javascript', express.static(path.join(__dirname, '../client/javascript')));
  app.use('/request/room/:room_code', rateLimiter());
  app.use(router);
  app.use(defaultToError);
  app.use(handleErrors);
}

function rateLimiter(): rateLimit {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
  });
}

function defaultToError(req: Request, res: Response, next: NextFunction): void {
  next(createError(404));
}

function handleErrors(err: any, req: Request, res: Response): void {
  console.error(err.message);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

function wrap(middleware) {
  return (socket, next) => middleware(socket.request, {}, next);
}
