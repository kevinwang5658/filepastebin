import { NextFunction, Request, Response, Router } from "express";
import { Constants } from "../../shared/constants";
import { RoomCodeToRoomIdMap, RoomsMap } from '../clients/temp';
import REQUEST_JOIN_ROOM = Constants.REQUEST_JOIN_ROOM;

const router = Router();
const roomsMap = RoomsMap;
const roomCodeToRoomIdMap = RoomCodeToRoomIdMap;

router.get('/', (req: Request, res: Response) => {
  res.render('index');
});

router.get('/info', (req: Request, res: Response) => {
  res.render('info');
});

router.get(REQUEST_JOIN_ROOM + ':room_code', (req: Request, res: Response, next: NextFunction) => {
  if (req.params.room_code && roomCodeToRoomIdMap.get(req.params.room_code)) {
    res.send({
      roomId: roomCodeToRoomIdMap.get(req.params.room_code)
    });
  } else {
    res.send(null);
  }
});

router.get('/:room_id', (req: Request, res: Response, next: NextFunction) => {
  if (req.params.room_id && roomsMap.get(req.params.room_id)) {
    let roomId = req.params.room_id;
    let roomState = roomsMap.get(roomId);

    // Prevent multiple devices from accessing file
    if (roomState.ipAddress && roomState.ipAddress !== req.ip) {
      next()
      return
    }
    roomState.ipAddress = req.ip;

    res.render('download', {
      code: escape(roomId),
      files: escape(JSON.stringify(roomState.files))
    })
  } else {
    next()
  }
});

export default router;