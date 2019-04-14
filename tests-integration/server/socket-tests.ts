import {after, afterEach, before, beforeEach, describe} from 'mocha'
import {HostModel} from "../../src/server/models/models";
import {SocketManager} from "../../src/server/rtc/socketmanager";
import * as http from 'http';
import * as io from 'socket.io-client';
import {Constants} from "../../src/shared/constants";
import {assert} from 'chai';
import {Message, MessageAction, MessageType} from "../../src/client/javascript/connection/message";
import REQUEST_HOST = Constants.REQUEST_HOST;
import RequestHostRequestModel = Constants.RequestHostRequestModel;
import REQUEST_HOST_ACCEPTED = Constants.REQUEST_HOST_ACCEPTED;
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import REQUEST_CLIENT = Constants.REQUEST_CLIENT;
import REQUEST_CLIENT_ACCEPTED = Constants.REQUEST_CLIENT_ACCEPTED;
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;
import MESSAGE = Constants.MESSAGE;

const request = require('supertest');

const ROOM_ID = '123234';
const HOST_MODEL = <HostModel>{
    roomId: ROOM_ID,
    hostId: "host_id",
    fileName: "file_name",
    fileSize: 100,
    fileType: "file_type"
};

let hostMap: Map<string, HostModel>;
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
        socketManager = new SocketManager(server, hostMap);
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
            fileName: HOST_MODEL.fileName,
            fileType: HOST_MODEL.fileType,
            fileSize: HOST_MODEL.fileSize
        });

        host.on(REQUEST_HOST_ACCEPTED, (response: RequestHostAcceptedModel) => {
            assert.isNotNull(response.roomId);
            assert.equal(response.fileName, HOST_MODEL.fileName);
            assert.equal(response.fileType, HOST_MODEL.fileType);
            assert.equal(response.fileSize, HOST_MODEL.fileSize);

            done();
        })
    });

    it('is able to request a client', done => {
        host.emit(REQUEST_HOST, <RequestHostAcceptedModel> {
            fileName: HOST_MODEL.fileName,
            fileType: HOST_MODEL.fileType,
            fileSize: HOST_MODEL.fileSize
        });

        host.on(REQUEST_HOST_ACCEPTED, (hResponse: RequestHostAcceptedModel) => {
            assert.isNotNull(hResponse.roomId);

            client.emit(REQUEST_CLIENT, hResponse.roomId);

            client.on(REQUEST_CLIENT_ACCEPTED, (cResponse: RequestClientAcceptedModel) => {
                assert.equal(cResponse.roomId, hResponse.roomId);
                assert.equal(cResponse.fileName, HOST_MODEL.fileName);
                assert.equal(cResponse.fileType, HOST_MODEL.fileType);
                assert.equal(cResponse.fileSize, HOST_MODEL.fileSize);

                done();
            });
        })
    });

    it('is able to send messages', done => {
        host.emit(REQUEST_HOST, <RequestHostAcceptedModel>{
            fileName: HOST_MODEL.fileName,
            fileType: HOST_MODEL.fileType,
            fileSize: HOST_MODEL.fileSize
        });

        host.on(REQUEST_HOST_ACCEPTED, (hResponse: RequestHostAcceptedModel) => {
            assert.isNotNull(hResponse.roomId);

            client.emit(REQUEST_CLIENT, hResponse.roomId);
            client.on(REQUEST_CLIENT_ACCEPTED, (cResponse: RequestClientAcceptedModel) => {

                let message = new Message(client.id, MessageType.Signal, MessageAction.Offer, "");
                client.send(message);

                host.on(MESSAGE, (response: Message) => {
                    assert.deepStrictEqual(response, message);

                    done()
                });
            })
        })
    });

    afterEach(() => {
        host.close();
        client.close();
    });

    after(() => {
        server.close();
    });
});