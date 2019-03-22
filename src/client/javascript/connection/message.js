(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Message = /** @class */ (function () {
        function Message(senderId, type, action, content) {
            this.senderId = senderId;
            this.type = type;
            this.action = action;
            this.content = content;
        }
        return Message;
    }());
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
    var FileChunkRequest = /** @class */ (function () {
        function FileChunkRequest(fileName, chunkStart, chunkEnd) {
            this.fileName = fileName;
            this.chunkStart = chunkStart;
            this.chunkEnd = chunkEnd;
        }
        return FileChunkRequest;
    }());
    exports.FileChunkRequest = FileChunkRequest;
});
//# sourceMappingURL=message.js.map