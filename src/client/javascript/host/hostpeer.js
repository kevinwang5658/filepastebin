var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../connection/peerwrapper", "../connection/rtcfilesender", "../../../shared/constants", "../connection/socketfilesender"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var peerwrapper_1 = require("../connection/peerwrapper");
    var rtcfilesender_1 = require("../connection/rtcfilesender");
    var constants_1 = require("../../../shared/constants");
    var RTC_INIT_TIMEOUT = constants_1.Constants.RTC_INIT_TIMEOUT;
    var socketfilesender_1 = require("../connection/socketfilesender");
    var HostPeer = /** @class */ (function () {
        function HostPeer(id, socket, fileSlice) {
            var _this = this;
            this.id = id;
            this.socket = socket;
            this.fileSlice = fileSlice;
            this.progress = 0;
            this.handleMessage = function (message) {
                _this.rtcWrapper.handleMessage(message);
            };
            this.onopen = function (fileSender) {
                console.log("onopen: " + _this.id);
                _this.fileSender = fileSender;
                _this.fileSender.onprogresschanged = _this.onprogresschanged;
                _this.fileSender.sendFiles();
            };
            this.onrtcerror = function (err) { return console.log("onerror" + err); };
            this.onrtcclose = function () {
                console.log('onclosed');
                _this.fileSender = new socketfilesender_1.SocketFileSender(_this.fileSlice, _this.socket, _this.id);
                _this.fileSender.sendFiles(_this.progress);
            };
            this.onprogresschanged = function (progress) {
                _this.progress = progress;
                //console.log(this.progress);
            };
            this.rtcPeer = new RTCPeerConnection(constants_1.Constants.PeerConfiguration);
            this.rtcWrapper = new peerwrapper_1.HostPeerWrapper(this.rtcPeer, this.id, this.socket);
            this.init();
        }
        HostPeer.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    Promise.race([
                        this.rtcWrapper.initDataChannel()
                            .then(function (dataChannel) {
                            dataChannel.onclose = _this.onrtcclose;
                            dataChannel.onerror = _this.onrtcerror;
                            return new rtcfilesender_1.RtcFileSender(_this.fileSlice, dataChannel);
                        }),
                        new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve(new socketfilesender_1.SocketFileSender(_this.fileSlice, _this.socket, _this.id));
                            }, RTC_INIT_TIMEOUT);
                        }),
                        new Promise(function (resolve) {
                            var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
                            if (iOS) {
                                resolve(new socketfilesender_1.SocketFileSender(_this.fileSlice, _this.socket, _this.id));
                            }
                        })
                    ]).then(function (fileSender) {
                        _this.onopen(fileSender);
                    });
                    return [2 /*return*/];
                });
            });
        };
        return HostPeer;
    }());
    exports.HostPeer = HostPeer;
});
//# sourceMappingURL=hostpeer.js.map