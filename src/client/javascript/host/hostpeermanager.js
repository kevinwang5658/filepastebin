(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../connection/message", "./hostpeer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var message_1 = require("../connection/message");
    var hostpeer_1 = require("./hostpeer");
    var HostPeerManager = /** @class */ (function () {
        function HostPeerManager(socket, file) {
            var _this = this;
            this.socket = socket;
            this.file = file;
            this.workers = new Map();
            this.handleMessage = function (message) {
                if (message.type === message_1.MessageType.Request && message.action === message_1.MessageAction.CreatePeer) {
                    var request = message.content;
                    console.log(message.content);
                    _this.workers.set(message.senderId, new hostpeer_1.HostPeer(message.senderId, _this.socket, _this.file.slice(request.chunkStart, request.chunkEnd)));
                }
                else if (message.type === message_1.MessageType.Signal) {
                    _this.workers.get(message.senderId).handleMessage(message);
                }
            };
        }
        return HostPeerManager;
    }());
    exports.HostPeerManager = HostPeerManager;
});
//# sourceMappingURL=hostpeermanager.js.map