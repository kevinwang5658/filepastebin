import { describe } from 'mocha';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import * as App from '../../src/server/app';
import { Host } from '../../src/server/signaling/entities';
import { HostMap, RoomCodeToHostIdMap } from '../../src/server/storage';

const ROOM_ID = uuidv4();
const ROOM_CODE = '123234';

const HOST_MODEL = <Host>{
  id: ROOM_ID,
  roomCode: ROOM_CODE,
  hostId: 'host_id',
  files: [
    {
      fileName: 'file_name',
      fileSize: 100,
      fileType: 'file_type',
    },
  ],
};

const hostMap = HostMap;
const roomCodeToRoomIdMap = RoomCodeToHostIdMap;
hostMap.set(ROOM_ID, HOST_MODEL);
roomCodeToRoomIdMap.set(ROOM_CODE, ROOM_ID);

const app = App.newExpressInstance();

describe('GET /', () => {
  it('responds with html', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});

describe('GET /request/room/:room_code', () => {
  it('creates a room', (done) => {
    request(app)
      .get(`/request/room/${ROOM_CODE}`)
      .expect(200, { roomId: ROOM_ID }, done);
  });

  it('rejects wrong room ids', (done) => {
    request(app)
      .get('/request/room/123193')
      .expect(200, {}, done);
  });

  it('rejects empty room ids', (done) => {
    request(app)
      .get('/request/room/')
      .expect(404, done);
  });
});

describe('GET /:room_id', () => {
  it('responds with html', (done) => {
    request(app)
      .get(`/${ROOM_ID}`)
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('responds with 404 on not found', (done) => {
    request(app)
      .get('/' + uuidv4())
      .expect(404, done);
  });
});
