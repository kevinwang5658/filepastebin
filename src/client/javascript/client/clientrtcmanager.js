var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../shared/constants", "./clientpeer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var constants_1 = require("../../../shared/constants");
    var clientpeer_1 = require("./clientpeer");
    var NUMBER_WORKERS = constants_1.Constants.NUMBER_WORKERS;
    var ClientRTCManager = /** @class */ (function () {
        function ClientRTCManager(socket, fileName, fileSize, fileType) {
            var _this = this;
            this.socket = socket;
            this.fileName = fileName;
            this.fileSize = fileSize;
            this.fileType = fileType;
            this.workers = new Map();
            this.initializeWorkers = function () {
                var chunkStart = 0;
                while (chunkStart < _this.fileSize) {
                    var id = _this.fileName + chunkStart;
                    _this.workers.set(id, new clientpeer_1.ClientPeer(id, _this.socket, _this.fileName, chunkStart, Math.min(_this.fileSize, chunkStart + _this.workerFileSize), _this.workerFileSize));
                    chunkStart += _this.workerFileSize;
                }
                Promise.all(__spread(_this.workers.values()).map(function (peer) { return peer.getCompleteListener(); }))
                    .then(function (value) {
                    _this.onDataLoaded(value);
                });
                __spread(_this.workers.values()).forEach(function (peer) { return peer.onprogresschanged = _this.handleprogresschanged; });
            };
            this.handleMessage = function (message) {
                _this.workers.get(message.senderId).handleMessage(message);
            };
            this.onprogresschanged = function (number) { };
            this.handleprogresschanged = function () {
                var progress = __spread(_this.workers.values()).map(function (peer) { return peer.progress; })
                    .map(function (progress) { return progress * (_this.workerFileSize / _this.fileSize) * 100; })
                    .reduce(function (previousValue, currentValue) { return previousValue + currentValue; });
                _this.onprogresschanged(progress);
            };
            this.onDataLoaded = function (value) {
                download(new Blob([].concat.apply([], __spread(value)), {
                    type: _this.fileType
                }), _this.fileName, _this.fileType);
            };
            this.workerFileSize = Math.ceil(fileSize / NUMBER_WORKERS);
        }
        return ClientRTCManager;
    }());
    exports.ClientRTCManager = ClientRTCManager;
});
//# sourceMappingURL=clientrtcmanager.js.map