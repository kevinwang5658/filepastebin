(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../shared/constants", "./hostpeermanager"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var constants_1 = require("../../../shared/constants");
    var MESSAGE = constants_1.Constants.MESSAGE;
    var DISCONNECT = constants_1.Constants.DISCONNECT;
    var ERROR = constants_1.Constants.ERROR;
    var REQUEST_HOST_ACCEPTED = constants_1.Constants.REQUEST_HOST_ACCEPTED;
    var hostpeermanager_1 = require("./hostpeermanager");
    var HostSocketManager = /** @class */ (function () {
        function HostSocketManager(socket, file) {
            var _this = this;
            this.socket = socket;
            this.file = file;
            this.requestHost = function () {
                _this.socket.emit(constants_1.Constants.REQUEST_HOST, {
                    fileName: _this.file.name,
                    fileSize: _this.file.size,
                    fileType: _this.file.type
                });
            };
            this.onhost = function (response) {
                _this.hostacceptedcallback(response);
            };
            this.onmessage = function (message) {
                _this.peerManager.handleMessage(message);
            };
            socket.on(DISCONNECT, function (reason) { return console.log(reason); });
            socket.on(ERROR, function (err) { return console.log(err); });
            socket.on(REQUEST_HOST_ACCEPTED, this.onhost);
            socket.on(MESSAGE, this.onmessage);
            this.peerManager = new hostpeermanager_1.HostPeerManager(socket, file);
            this.requestHost();
        }
        return HostSocketManager;
    }());
    exports.HostSocketManager = HostSocketManager;
});
//# sourceMappingURL=hostsocketmanager.js.map