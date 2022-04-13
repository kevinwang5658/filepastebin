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
const base_1 = require("../../../src/server/signaling/base");
const mocha_1 = require("mocha");
const message_1 = require("../../../src/client/javascript/webrtc-base/models/message");
const TypeMoq = __importStar(require("typemoq"));
(0, mocha_1.describe)('Base', () => {
    let socketMock;
    let instance;
    const ID = "id1";
    (0, mocha_1.beforeEach)(() => {
        socketMock = TypeMoq.Mock.ofType();
        socketMock.setup(x => x.to(TypeMoq.It.isAnyString())).returns(() => socketMock.object);
        socketMock.setup(x => x.id).returns(() => ID);
        instance = new base_1.Base(socketMock.object);
    });
    it('should relay messages to others in room', async () => {
        let message = new message_1.Message(ID, message_1.MessageType.Data, message_1.MessageAction.Answer, "content");
        let rooms = { ID: "socket1", "id2": "socket2" };
        socketMock.setup(x => x.rooms).returns(() => rooms);
        instance.onmessage(message);
        socketMock.verify(x => x.to("id2"), TypeMoq.Times.once());
        socketMock.verify(x => x.to("id1"), TypeMoq.Times.never());
    });
});
