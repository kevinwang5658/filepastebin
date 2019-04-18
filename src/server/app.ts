import {HostModel} from "./models/models";
import {NextFunction, Request, Response} from "express";
import {Logger} from "./config/logger";
import {StreamOptions} from "morgan";
import {Constants} from "../shared/constants";
import REQUEST_JOIN_ROOM = Constants.REQUEST_JOIN_ROOM;

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const prettyBytes = require('pretty-bytes');

export const newInstance = (hostMap: Map<String, HostModel>) => {
  let app = express();

  // view engine setup
  app.set('views', path.join(__dirname, '../client/views'));
  app.set('view engine', 'ejs');

  app.use(logger('combined', {
    stream:<StreamOptions>{
      write(str: string): void {
        if (!process.env.DEV) {
          Logger.info(str) //Using winston for production
        } else {
          console.log(str);
        }
      }
    }
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use('/', express.static(path.join(__dirname, '../client/public')));
  app.use('/shared', express.static(path.join(__dirname, '../shared')));
  app.use('/javascript', express.static(path.join(__dirname, '../client/javascript')));
  app.use('/', express.static(path.join(__dirname, '../client/node_modules')));

  app.get('/', (req: Request, res: Response) => {
    res.render('index', {
      dev: process.env.DEV && process.env.DEBUG,
    });
  });

  app.get(REQUEST_JOIN_ROOM + ':room_id', (req: Request, res: Response, next: NextFunction) => {
    if (req.params.room_id && hostMap.get(req.params.room_id)) {
      res.send(true);
    } else {
      res.send(false);
    }
  });

  app.get('/:room_id', (req: Request, res: Response, next: NextFunction) => {
    if (req.params.room_id && hostMap.get(req.params.room_id)) {

      let sessionId = req.params.room_id;
      let hostModel = hostMap.get(req.params.room_id);

      res.render('download', {
        dev: process.env.DEV && process.env.DEBUG,
        code: sessionId,
        fileName: hostModel.fileName,
        fileSize: prettyBytes(hostModel.fileSize)

      })
    } else {
      next()
    }
  });

// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

// error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });


  return app
};
