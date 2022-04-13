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
const TypeMoq = __importStar(require("typemoq"));
const client_1 = require("../../../src/server/signaling/client");
const constants_1 = require("../../../src/server/constants");
var REQUEST_CLIENT_ACCEPTED = constants_1.Constants.REQUEST_CLIENT_ACCEPTED;
const chai_1 = require("chai");
(0, mocha_1.describe)("Client", () => {
    const ROOM_ID = "room_id";
    const HOST_MODEL = {
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
    let instance;
    let socketMock;
    let ioMock;
    let roomMap = new Map();
    roomMap.set(ROOM_ID, HOST_MODEL);
    (0, mocha_1.beforeEach)(() => {
        socketMock = TypeMoq.Mock.ofType();
        ioMock = TypeMoq.Mock.ofType();
    });
    it("should be able to create a client", () => {
        instance = new client_1.Client(socketMock.object, ioMock.object, roomMap, ROOM_ID);
        instance.createClient();
        socketMock.verify(x => x.join(ROOM_ID), TypeMoq.Times.once());
        socketMock.verify(x => x.emit(REQUEST_CLIENT_ACCEPTED, TypeMoq.It.is(r => {
            chai_1.assert.equal(r.files[0].fileName, HOST_MODEL.files[0].fileName);
            chai_1.assert.equal(r.files[0].fileSize, HOST_MODEL.files[0].fileSize);
            chai_1.assert.equal(r.files[0].fileType, HOST_MODEL.files[0].fileType);
            return true;
        })), TypeMoq.Times.once());
    });
    it("should return error is host is unavailable", () => {
        instance = new client_1.Client(socketMock.object, ioMock.object, new Map(), ROOM_ID);
        instance.createClient();
        socketMock.verify(x => x.emit("exception", TypeMoq.It.isAnyString()), TypeMoq.Times.once());
        socketMock.verify(x => x.join(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
        socketMock.verify(x => x.emit(REQUEST_CLIENT_ACCEPTED, TypeMoq.It.isAny()), TypeMoq.Times.never());
    });
});
