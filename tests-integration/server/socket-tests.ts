import { assert } from 'chai';
import { after, afterEach, before, beforeEach, describe } from 'mocha';
import { Socket } from 'socket.io-client';
import * as io from 'socket.io-client';
import * as App from '../../src/server/app';
import { v4 as uuidv4 } from 'uuid';
import * as http from 'http';
import {
  Host,
  RequestClientAcceptedModel,
  RequestHostAcceptedModel,
  RequestHostRequestModel,
} from '../../src/server/signaling/entities';
import { RoomMap, RoomCodeToHostIdMap } from '../../src/server/storage';

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

let server: http.Server;
let serverAddress;
let host: Socket;
let client: Socket;

describe('Socket', function () {
  before(() => {
    server = http.createServer().listen();
    serverAddress = server.address();
    App.newSocketIOInstance(server);
  });

  beforeEach(async () => {
    host = io.connect(`http://[${serverAddress.address}]:${serverAddress.port}`, {
      reconnectionDelay: 0,
      forceNew: true,
    });

    client = io.connect(`http://[${serverAddress.address}]:${serverAddress.port}`, {
      reconnectionDelay: 0,
      forceNew: true,
    });

    await Promise.all([
      new Promise((resolve) => {
        host.on('connect', () => {
          resolve(null);
        });
      }),
      new Promise((resolve) => {
        client.on('connect', () => {
          resolve(null);
        });
      })]);
  });

  it('is able to request host', (done) => {
    host.emit('request-host', <RequestHostRequestModel>{
      files: [
        {
          fileName: HOST_MODEL.files[0].fileName,
          fileType: HOST_MODEL.files[0].fileType,
          fileSize: HOST_MODEL.files[0].fileSize,
        },
      ],
    });

    host.on('request-host-accepted', (response: RequestHostAcceptedModel) => {
      assert.isNotNull(response.roomCode);
      assert.equal(response.files[0].fileName, HOST_MODEL.files[0].fileName);
      assert.equal(response.files[0].fileType, HOST_MODEL.files[0].fileType);
      assert.equal(response.files[0].fileSize, HOST_MODEL.files[0].fileSize);

      done();
    });
  });

  it('is able to request a client', (done) => {
    RoomMap.set(ROOM_ID, HOST_MODEL);
    RoomCodeToHostIdMap.set(ROOM_CODE, ROOM_ID);

    client.emit('request-client', ROOM_ID);

    client.on('request-client-accepted', (cResponse: RequestClientAcceptedModel) => {
      assert.equal(cResponse.roomId, ROOM_ID);
      assert.deepEqual(cResponse.files, HOST_MODEL.files);
      done();
    });
  });

  afterEach(() => {
    host.close();
    client.close();
    RoomMap.clear();
    RoomCodeToHostIdMap.clear();
  });

  after(() => {
    server.close();
  });
});
