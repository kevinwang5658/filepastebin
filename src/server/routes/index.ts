import express, { Request, Response } from 'express';
import path from 'path';
import { RoomCodeToHostIdMap } from '../storage';

const router = express.Router();

const publicDir = path.join(__dirname, '../../client/public');

router.get('/info', (req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, 'info/index.html'));
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

router.get('/:room_id', (req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, 'download.html'));
});

export default router;
