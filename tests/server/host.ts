import { assert } from 'chai';
import { describe } from 'mocha';
import { Host, RequestHostRequestModel } from '../../src/server/signaling/entities';
import { RoomService } from '../../src/server/signaling/roomService';
import { RoomMap, RoomCodeToHostIdMap } from '../../src/server/storage';

const hostMap = RoomMap;
const roomCodeToHostIdMap = RoomCodeToHostIdMap;

describe('Host', () => {

  const HOST_MODEL = <RequestHostRequestModel>{
    files: [
      {
        fileName: 'file_name',
        fileSize: 100,
        fileType: 'file_type',
      },
    ],
  };

  it('is able to create a host', () => {
    RoomService.createRoom(HOST_MODEL);

    assert.equal(hostMap.size, 1);
    const host = hostMap.values().next().value as Host;
    assert.equal(host.files[0].fileName, HOST_MODEL.files[0].fileName);
    assert.equal(host.files[0].fileSize, HOST_MODEL.files[0].fileSize);
    assert.equal(host.files[0].fileType, HOST_MODEL.files[0].fileType);
    assert.exists(host.id);
  });

  it('is able to destroy a host', () => {
    RoomService.createRoom(HOST_MODEL);
    assert.equal(hostMap.size, 1);
    const id = (hostMap.values().next().value as Host).id;

    RoomService.destroyRoom(id);
    assert.equal(hostMap.size, 0);
  });

  afterEach(() => {
    hostMap.clear();
    roomCodeToHostIdMap.clear();
  });
});
