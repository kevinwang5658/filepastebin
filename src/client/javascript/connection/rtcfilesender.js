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
        define(["require", "exports", "../../../shared/constants"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var constants_1 = require("../../../shared/constants");
    var BYTES_PER_CHUNK = constants_1.Constants.BYTES_PER_CHUNK;
    var MAX_BUFFER = constants_1.Constants.MAX_BUFFER;
    var EOF = constants_1.Constants.EOF;
    var RtcFileSender = /** @class */ (function () {
        function RtcFileSender(file, dataChannel) {
            var _this = this;
            this.file = file;
            this.dataChannel = dataChannel;
            this.currentChunk = 0;
            this.fileReader = new FileReader();
            this.sendFiles = function (progress) {
                if (progress === void 0) { progress = 0; }
                return __awaiter(_this, void 0, void 0, function () {
                    var start, end;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.currentChunk = progress / BYTES_PER_CHUNK;
                                _a.label = 1;
                            case 1:
                                if (!(this.currentChunk * BYTES_PER_CHUNK < this.file.size)) return [3 /*break*/, 5];
                                if (!(this.dataChannel.bufferedAmount > MAX_BUFFER)) return [3 /*break*/, 3];
                                return [4 /*yield*/, this.bufferedAmountLow()];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                start = BYTES_PER_CHUNK * this.currentChunk;
                                end = Math.min(this.file.size, start + BYTES_PER_CHUNK);
                                return [4 /*yield*/, this.readAsArrayBuffer(this.file.slice(start, end))];
                            case 4:
                                _a.sent();
                                this.dataChannel.send(this.fileReader.result);
                                this.currentChunk++;
                                this.onprogresschanged(this.currentChunk * BYTES_PER_CHUNK);
                                return [3 /*break*/, 1];
                            case 5:
                                this.dataChannel.send(EOF);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            this.onprogresschanged = function (progress_) { };
            this.readAsArrayBuffer = function (file) {
                return new Promise(function (resolve, reject) {
                    _this.fileReader.onload = function () { return resolve(_this.fileReader.result); };
                    _this.fileReader.onerror = reject;
                    _this.fileReader.readAsArrayBuffer(file);
                });
            };
            this.bufferedAmountLow = function () {
                return new Promise(function (resolve, reject) {
                    try {
                        _this.bufferAmountLowTimer(resolve);
                        _this.dataChannel.addEventListener('bufferedamountlow', function () { return resolve(); }, { once: true });
                    }
                    catch (err) {
                        console.log(err);
                        reject();
                    }
                });
            };
            this.bufferAmountLowTimer = function (resolve) {
                setTimeout(function () {
                    if (_this.dataChannel.bufferedAmount > BYTES_PER_CHUNK) {
                        _this.bufferedAmountLow();
                    }
                    else {
                        resolve();
                    }
                }, 1000);
            };
            this.dataChannel.bufferedAmountLowThreshold = BYTES_PER_CHUNK;
        }
        return RtcFileSender;
    }());
    exports.RtcFileSender = RtcFileSender;
});
//# sourceMappingURL=rtcfilesender.js.map