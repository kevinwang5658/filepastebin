(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../shared/constants", "./clientrtcmanager"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var constants_1 = require("../../../shared/constants");
    var REQUEST_CLIENT = constants_1.Constants.REQUEST_CLIENT;
    var REQUEST_CLIENT_ACCEPTED = constants_1.Constants.REQUEST_CLIENT_ACCEPTED;
    var clientrtcmanager_1 = require("./clientrtcmanager");
    var MESSAGE = constants_1.Constants.MESSAGE;
    var ClientSocketManager = /** @class */ (function () {
        function ClientSocketManager(socket, roomId) {
            var _this = this;
            this.socket = socket;
            this.roomId = roomId;
            this.requestDownload = function () {
                if (_this.rtcManager) {
                    _this.rtcManager.initializeWorkers();
                }
            };
            this.onprogresschanged = function (progress) { };
            this.requestClient = function () {
                _this.socket.emit(REQUEST_CLIENT, _this.roomId);
            };
            this.requestClientAccepted = function (res) {
                _this.rtcManager = new clientrtcmanager_1.ClientRTCManager(_this.socket, res.fileName, res.fileSize, res.fileType);
                _this.rtcManager.onprogresschanged = _this.handleProgressChanged;
            };
            this.onmessage = function (message) {
                _this.rtcManager.handleMessage(message);
            };
            this.handleProgressChanged = function (progress) {
                _this.onprogresschanged(progress);
            };
            socket.on(REQUEST_CLIENT_ACCEPTED, this.requestClientAccepted);
            socket.on(MESSAGE, this.onmessage);
            this.requestClient();
        }
        return ClientSocketManager;
    }());
    exports.ClientSocketManager = ClientSocketManager;
});
//# sourceMappingURL=clientsocketmanager.js.map