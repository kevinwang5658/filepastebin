"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const socket_manager_1 = require("../../src/server/signaling/socket-manager");
const http = __importStar(require("http"));
const io = __importStar(require("socket.io-client"));
const constants_1 = require("../../src/server/constants");
const chai_1 = require("chai");
var REQUEST_HOST = constants_1.Constants.REQUEST_HOST;
var REQUEST_HOST_ACCEPTED = constants_1.Constants.REQUEST_HOST_ACCEPTED;
var REQUEST_CLIENT = constants_1.Constants.REQUEST_CLIENT;
var REQUEST_CLIENT_ACCEPTED = constants_1.Constants.REQUEST_CLIENT_ACCEPTED;
const uuid_1 = require("uuid");
const request = require('supertest');
const ROOM_ID = (0, uuid_1.v4)();
const ROOM_CODE = '123234';
const HOST_MODEL = {
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
let hostMap;
let roomCodeToRoomIdMap;
let server;
let serverAddress;
let socketManager;
let host;
let client;
(0, mocha_1.describe)('Socket', function () {
    (0, mocha_1.before)(() => {
        server = http.createServer().listen();
        serverAddress = server.address();
        hostMap = new Map();
        roomCodeToRoomIdMap = new Map();
        socketManager = new socket_manager_1.SocketManager(server, hostMap, roomCodeToRoomIdMap);
    });
    (0, mocha_1.beforeEach)(async () => {
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
            })
        ]);
    });
    it('is able to request host', done => {
        host.emit(REQUEST_HOST, {
            files: [
                {
                    fileName: HOST_MODEL.files[0].fileName,
                    fileType: HOST_MODEL.files[0].fileType,
                    fileSize: HOST_MODEL.files[0].fileSize
                }
            ]
        });
        host.on(REQUEST_HOST_ACCEPTED, (response) => {
            chai_1.assert.isNotNull(response.roomCode);
            chai_1.assert.equal(response.files[0].fileName, HOST_MODEL.files[0].fileName);
            chai_1.assert.equal(response.files[0].fileType, HOST_MODEL.files[0].fileType);
            chai_1.assert.equal(response.files[0].fileSize, HOST_MODEL.files[0].fileSize);
            done();
        });
    });
    it('is able to request a client', done => {
        hostMap.set(ROOM_ID, HOST_MODEL);
        roomCodeToRoomIdMap.set(ROOM_CODE, ROOM_ID);
        client.emit(REQUEST_CLIENT, ROOM_ID);
        client.on(REQUEST_CLIENT_ACCEPTED, (cResponse) => {
            chai_1.assert.equal(cResponse.roomId, ROOM_ID);
            chai_1.assert.deepEqual(cResponse.files, HOST_MODEL.files);
            done();
        });
    });
    (0, mocha_1.afterEach)(() => {
        host.close();
        client.close();
    });
    (0, mocha_1.after)(() => {
        server.close();
    });
});
