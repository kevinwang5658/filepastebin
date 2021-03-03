import {after, afterEach, before, beforeEach, describe} from 'mocha'
import {HostModel} from "../../src/server/models/hostModel";
import {SocketManager} from "../../src/server/signaling/socketManager";
import * as http from 'http';
import * as io from 'socket.io-client';
import {Constants} from "../../src/shared/constants";
import {assert} from 'chai';
import {Message, MessageAction, MessageType} from "../../src/client/javascript/webrtc-base/models/message";
import REQUEST_HOST = Constants.REQUEST_HOST;
import RequestHostRequestModel = Constants.RequestHostRequestModel;
import REQUEST_HOST_ACCEPTED = Constants.REQUEST_HOST_ACCEPTED;
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import REQUEST_CLIENT = Constants.REQUEST_CLIENT;
import REQUEST_CLIENT_ACCEPTED = Constants.REQUEST_CLIENT_ACCEPTED;
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;
import MESSAGE = Constants.MESSAGE;
import { v4 as uuidv4 } from 'uuid';

const request = require('supertest');

const ROOM_ID = uuidv4();
const ROOM_CODE = '123234';
const HOST_MODEL = <HostModel>{
    roomId: ROOM_ID,
    roomCode: ROOM_CODE,
    hostId: "host_id",
    files: [
        {
            fileName: "file_name",
            fileSize: 100,
            fileType: "file_type"
        }
    ]
};

let hostMap: Map<string, HostModel>;
let roomCodeToRoomIdMap: Map<string, string>;
let server: http.Server;
let serverAddress;
let socketManager: SocketManager;
let host: SocketIOClient.Socket;
let client: SocketIOClient.Socket;

describe('Socket', function () {
    before(() => {
        server = http.createServer().listen();
        serverAddress = server.address();
        hostMap = new Map<string, HostModel>();
        roomCodeToRoomIdMap = new Map<string, string>();
        socketManager = new SocketManager(server, hostMap, roomCodeToRoomIdMap);
    });

    beforeEach(async () => {
        host = io.connect(`http://[${serverAddress.address}]:${serverAddress.port}`, {
            reconnectionDelay: 0,
            forceNew: true
        });

        client = io.connect(`http://[${serverAddress.address}]:${serverAddress.port}`, {
            reconnectionDelay: 0,
            forceNew: true
        });

        await Promise.all([
            new Promise(resolve => {
                host.on('connect', () => {
                    resolve();
                });
            }),
            new Promise(resolve => {
                client.on('connect', () => {
                    resolve();
                });
            })])
    });

    it('is able to request host', done => {
        host.emit(REQUEST_HOST, <RequestHostRequestModel> {
            files: [
                {
                    fileName: HOST_MODEL.files[0].fileName,
                    fileType: HOST_MODEL.files[0].fileType,
                    fileSize: HOST_MODEL.files[0].fileSize
                }
            ]
        });

        host.on(REQUEST_HOST_ACCEPTED, (response: RequestHostAcceptedModel) => {
            assert.isNotNull(response.roomId);
            assert.equal(response.files[0].fileName, HOST_MODEL.files[0].fileName);
            assert.equal(response.files[0].fileType, HOST_MODEL.files[0].fileType);
            assert.equal(response.files[0].fileSize, HOST_MODEL.files[0].fileSize);

            done();
        })
    });

    it('is able to request a client', done => {
        hostMap.set(ROOM_ID, HOST_MODEL);
        roomCodeToRoomIdMap.set(ROOM_CODE, ROOM_ID)

        client.emit(REQUEST_CLIENT, ROOM_ID);

        client.on(REQUEST_CLIENT_ACCEPTED, (cResponse: RequestClientAcceptedModel) => {
            assert.equal(cResponse.roomId, ROOM_ID);
            assert.deepEqual(cResponse.files, HOST_MODEL.files);
            done();
        });
    });

    afterEach(() => {
        host.close();
        client.close();
    });

    after(() => {
        server.close();
    });
});
