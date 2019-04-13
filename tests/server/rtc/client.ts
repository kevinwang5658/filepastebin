import {beforeEach, describe} from "mocha";
import * as TypeMoq from "typemoq"
import {Client} from "../../../src/server/rtc/client";
import {Socket} from "socket.io";
import * as SocketIO from "socket.io";
import {HostModel} from "../../../src/server/models/models";
import {Constants} from "../../../src/shared/constants";
import REQUEST_CLIENT_ACCEPTED = Constants.REQUEST_CLIENT_ACCEPTED;
import { assert } from "chai";
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;

describe("Client", () => {

    const ROOM_ID = "room_id";
    const HOST_MODEL = <HostModel> {
        roomId: ROOM_ID,
        hostId: "host_id",
        fileName: "file_name",
        fileSize: 100,
        fileType: "file_type"
    };

    let instance: Client;
    let socketMock: TypeMoq.IMock<Socket>;
    let ioMock: TypeMoq.IMock<SocketIO.Server>;
    let roomMap= new Map<string, HostModel>();
    roomMap.set(ROOM_ID, HOST_MODEL);

    beforeEach(() => {
        socketMock = TypeMoq.Mock.ofType<Socket>();
        ioMock = TypeMoq.Mock.ofType<SocketIO.Server>();
    });

    it("should be able to create a client", () => {
        instance = new Client(socketMock.object, ioMock.object, roomMap, ROOM_ID);
        instance.createClient();

        socketMock.verify(x => x.join(ROOM_ID), TypeMoq.Times.once());
        socketMock.verify(x => x.emit(REQUEST_CLIENT_ACCEPTED, TypeMoq.It.is<RequestClientAcceptedModel>(r => {
            assert.equal(r.fileName, HOST_MODEL.fileName);
            assert.equal(r.fileSize, HOST_MODEL.fileSize);
            assert.equal(r.fileType, HOST_MODEL.fileType);
            return true;
        })), TypeMoq.Times.once());
    });

    it("should return error is host is unavailable", () => {
        instance = new Client(socketMock.object, ioMock.object, new Map(), ROOM_ID);
        instance.createClient();

        socketMock.verify(x => x.emit("exception", TypeMoq.It.isAnyString()), TypeMoq.Times.once());
        socketMock.verify(x => x.join(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
        socketMock.verify(x => x.emit(REQUEST_CLIENT_ACCEPTED, TypeMoq.It.isAny()), TypeMoq.Times.never());

    });
});