"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRequest = exports.MessageAction = exports.MessageType = exports.Message = void 0;
class Message {
    constructor(senderId, type, action, content) {
        this.senderId = senderId;
        this.type = type;
        this.action = action;
        this.content = content;
    }
}
exports.Message = Message;
var MessageType;
(function (MessageType) {
    MessageType["Request"] = "request";
    MessageType["Signal"] = "signal";
    MessageType["Data"] = "data";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var MessageAction;
(function (MessageAction) {
    MessageAction["Offer"] = "offer";
    MessageAction["Answer"] = "answer";
    MessageAction["CreatePeer"] = "create-peer";
    MessageAction["IceCandidate"] = "ice-candidate";
})(MessageAction = exports.MessageAction || (exports.MessageAction = {}));
class FileRequest {
    constructor(fileName) {
        this.fileName = fileName;
    }
}
exports.FileRequest = FileRequest;
