(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../connection/message", "../connection/peerwrapper", "../connection/externalpromise", "../../../shared/constants"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var message_1 = require("../connection/message");
    var peerwrapper_1 = require("../connection/peerwrapper");
    var externalpromise_1 = require("../connection/externalpromise");
    var constants_1 = require("../../../shared/constants");
    var BYTES_PER_CHUNK = constants_1.Constants.BYTES_PER_CHUNK;
    var ClientPeer = /** @class */ (function () {
        function ClientPeer(id, socket, fileName, chunkStart, chunkEnd, chunkSize) {
            var _this = this;
            this.id = id;
            this.socket = socket;
            this.fileName = fileName;
            this.chunkStart = chunkStart;
            this.chunkEnd = chunkEnd;
            this.chunkSize = chunkSize;
            this.progress = 0;
            this.externalPromise = new externalpromise_1.ExternalPromise();
            this.fileData = [];
            this.handleMessage = function (message) {
                _this.rtcWrapper.handleMessage(message);
                if (message.type === message_1.MessageType.Data) {
                    _this.onmessage(message.content);
                }
            };
            this.onprogresschanged = function (number) { };
            this.requestFileChunk = function () { return _this.socket.send(new message_1.Message(_this.id, message_1.MessageType.Request, message_1.MessageAction.CreatePeer, new message_1.FileChunkRequest(_this.fileName, _this.chunkStart, _this.chunkEnd))); };
            this.init = function () {
                _this.rtcWrapper.initDataChannel()
                    .then(function (dataChannel) {
                    console.log("onopen: " + _this.id);
                    _this.dataChannel = dataChannel;
                    _this.dataChannel.onmessage = function (ev) { return _this.onmessage(ev.data); };
                });
                _this.requestFileChunk();
            };
            this.onmessage = function (message) {
                if (message !== 'eof') {
                    _this.fileData.push(message);
                    _this.progress = (_this.fileData.length * BYTES_PER_CHUNK) / _this.chunkSize;
                }
                else {
                    _this.externalPromise.resolve(_this.fileData);
                    _this.progress = 1;
                    if (_this.dataChannel) {
                        _this.dataChannel.close();
                        _this.rtcPeer.close();
                    }
                }
                _this.onprogresschanged(_this.progress);
            };
            this.rtcPeer = new RTCPeerConnection(constants_1.Constants.PeerConfiguration);
            this.rtcWrapper = new peerwrapper_1.ClientPeerWrapper(this.rtcPeer, id, socket);
            this.init();
        }
        ClientPeer.prototype.getCompleteListener = function () {
            return this.externalPromise.promise;
        };
        return ClientPeer;
    }());
    exports.ClientPeer = ClientPeer;
});
//# sourceMappingURL=clientpeer.js.map