import express, { NextFunction, Request, Response } from 'express';
import { HostMap, RoomCodeToHostIdMap } from '../storage';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index');
});

router.get('/info', (req: Request, res: Response) => {
  res.render('info');
});

router.get('/request/room/:room_code', (req: Request, res: Response) => {
  if (req.params.room_code && RoomCodeToHostIdMap.get(req.params.room_code)) {
    res.send({
      roomId: RoomCodeToHostIdMap.get(req.params.room_code),
    });
  } else {
    res.send(null);
  }
});

router.get('/:room_id', (req: Request, res: Response, next: NextFunction) => {
  if (req.params.room_id && HostMap.get(req.params.room_id)) {
    const sessionId = req.params.room_id;
    const host = HostMap.get(req.params.room_id);

    if (host.ipAddress && host.ipAddress !== req.ip) {
      next();
      return;
    }

    host.ipAddress = req.ip;

    res.render('download', {
      code: escape(sessionId),
      files: escape(JSON.stringify(host.files)),
    });
  } else {
    next();
  }
});

export default router;