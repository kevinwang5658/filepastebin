import { beforeEach, describe } from "mocha";
import * as TypeMoq from "typemoq"
import { Guest } from "../../../src/server/signaling/guest";
import { Socket } from "socket.io";
import * as SocketIO from "socket.io";
import { RoomState } from "../../../src/server/signaling/room-state";
import { Constants } from "../../../src/shared/constants";
import REQUEST_CLIENT_ACCEPTED = Constants.REQUEST_CLIENT_ACCEPTED;
import { assert } from "chai";
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;

describe("Client", () => {

  const ROOM_ID = "room_id";
  const HOST_MODEL = <RoomState>{
    roomId: ROOM_ID,
    hostId: "host_id",
    files: [
      {
        fileName: "file_name",
        fileSize: 100,
        fileType: "file_type"
      }
    ]
  };

  let instance: Guest;
  let socketMock: TypeMoq.IMock<Socket>;
  let ioMock: TypeMoq.IMock<SocketIO.Server>;
  let roomMap = new Map<string, RoomState>();
  roomMap.set(ROOM_ID, HOST_MODEL);

  beforeEach(() => {
    socketMock = TypeMoq.Mock.ofType<Socket>();
    ioMock = TypeMoq.Mock.ofType<SocketIO.Server>();
  });

  it("should be able to create a client", () => {
    instance = new Guest(socketMock.object, ioMock.object, roomMap, ROOM_ID);
    instance.joinRoomAsGuest();

    socketMock.verify(x => x.join(ROOM_ID), TypeMoq.Times.once());
    socketMock.verify(x => x.emit(REQUEST_CLIENT_ACCEPTED, TypeMoq.It.is<RequestClientAcceptedModel>(r => {
      assert.equal(r.files[0].fileName, HOST_MODEL.files[0].fileName);
      assert.equal(r.files[0].fileSize, HOST_MODEL.files[0].fileSize);
      assert.equal(r.files[0].fileType, HOST_MODEL.files[0].fileType);
      return true;
    })), TypeMoq.Times.once());
  });

  it("should return error is host is unavailable", () => {
    instance = new Guest(socketMock.object, ioMock.object, new Map(), ROOM_ID);
    instance.joinRoomAsGuest();

    socketMock.verify(x => x.emit("exception", TypeMoq.It.isAnyString()), TypeMoq.Times.once());
    socketMock.verify(x => x.join(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
    socketMock.verify(x => x.emit(REQUEST_CLIENT_ACCEPTED, TypeMoq.It.isAny()), TypeMoq.Times.never());
  });
});
