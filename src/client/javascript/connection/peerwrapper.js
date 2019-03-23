var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./message", "../../../shared/constants", "./externalpromise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var message_1 = require("./message");
    var constants_1 = require("../../../shared/constants");
    var RTC_OPEN = constants_1.Constants.RTC_OPEN;
    var externalpromise_1 = require("./externalpromise");
    var READY = constants_1.Constants.READY;
    var BasePeerWrapper = /** @class */ (function () {
        function BasePeerWrapper(peer, id, socket) {
            var _this = this;
            this.peer = peer;
            this.id = id;
            this.socket = socket;
            this.handleMessage = function (message) {
                if (message.type !== message_1.MessageType.Signal) {
                    return;
                }
                console.log('Got: ' + JSON.stringify(message));
                switch (message.action) {
                    case message_1.MessageAction.IceCandidate:
                        _this.peer
                            .addIceCandidate(new RTCIceCandidate(message.content))
                            .catch(function (err) { return console.error(err); });
                        break;
                    case message_1.MessageAction.Offer:
                        if (message.content !== null) {
                            _this.peer
                                .setRemoteDescription(message.content)
                                .then(function () {
                                _this.createAnswer();
                                console.log('Created Answer');
                            }).catch(function (err) { return console.error(err); });
                        }
                        break;
                    case message_1.MessageAction.Answer:
                        if (message.content !== null) {
                            _this.peer
                                .setRemoteDescription(message.content)
                                .then(function () {
                                console.log('Answer set');
                            }).catch(function (err) { return console.error(err); });
                        }
                        break;
                }
            };
            //*****************************
            // Socket Messages
            //*****************************
            this.createOffer = function () { return _this.peer.createOffer()
                .then(function (desc) {
                return _this.peer.setLocalDescription(desc);
            }).then(function (desc) {
                _this.sendOffer(_this.peer.localDescription.toJSON());
            }).catch(function (err) { return console.error(err); }); };
            this.createAnswer = function () { return _this.peer.createAnswer()
                .then(function (desc) {
                return _this.peer.setLocalDescription(desc);
            }).then(function (desc) {
                _this.sendAnswer(_this.peer.localDescription.toJSON());
            }).catch(function (err) { return console.error(err); }); };
            this.sendOffer = function (content) { return _this.socket.send(new message_1.Message(_this.id, message_1.MessageType.Signal, message_1.MessageAction.Offer, content)); };
            this.sendAnswer = function (content) { return _this.socket.send(new message_1.Message(_this.id, message_1.MessageType.Signal, message_1.MessageAction.Answer, content)); };
            this.sendIceCandidate = function (content) { return _this.socket.send(new message_1.Message(_this.id, message_1.MessageType.Signal, message_1.MessageAction.IceCandidate, content)); };
            //***************************
            // RTC lifecycle
            //***************************
            this.onicecandidateerror = function (err) { return console.log('Ice candidate error: ' + JSON.stringify(err)); };
            this.onicecandidate = function (event) {
                if (event.hasOwnProperty('candidate')) {
                    _this.sendIceCandidate(event.candidate);
                }
                console.log('Ice Candidate: ' + JSON.stringify(event));
            };
            this.onconnectionstatechange = function () { return console.log('Conenction state changed to: ' + _this.peer.connectionState); };
            this.peer.onconnectionstatechange = this.onconnectionstatechange;
            this.peer.onicecandidate = this.onicecandidate;
            this.peer.onicecandidateerror = this.onicecandidateerror;
        }
        return BasePeerWrapper;
    }());
    exports.BasePeerWrapper = BasePeerWrapper;
    //***************************************
    // Host Wrapper
    //***************************************
    var HostPeerWrapper = /** @class */ (function (_super) {
        __extends(HostPeerWrapper, _super);
        function HostPeerWrapper() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isNegotiating = false;
            _this.externalPromise = new externalpromise_1.ExternalPromise();
            _this.onnegotiationneeded = function () {
                console.log('Negotiation');
                if (_this.isNegotiating)
                    return;
                _this.isNegotiating = true;
                _this.createOffer();
            };
            _this.onsignalingstatechange = function () {
                console.log('Signaling state changed: ' + _this.peer.signalingState);
                _this.isNegotiating = (_this.peer.signalingState !== 'stable');
            };
            _this.ondatachannelready = function (message) {
                if (message.data === READY) {
                    _this.externalPromise.resolve(_this.dataChannel);
                }
            };
            return _this;
        }
        HostPeerWrapper.prototype.initDataChannel = function () {
            this.peer.onnegotiationneeded = this.onnegotiationneeded;
            this.peer.onsignalingstatechange = this.onsignalingstatechange;
            this.dataChannel = this.peer.createDataChannel(this.id);
            this.dataChannel.onmessage = this.ondatachannelready;
            return this.externalPromise.promise;
        };
        return HostPeerWrapper;
    }(BasePeerWrapper));
    exports.HostPeerWrapper = HostPeerWrapper;
    //*************************************
    // Client
    //*************************************
    var ClientPeerWrapper = /** @class */ (function (_super) {
        __extends(ClientPeerWrapper, _super);
        function ClientPeerWrapper() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.externalPromise = new externalpromise_1.ExternalPromise();
            _this.ondatachannel = function (event) {
                _this.dataChannel = event.channel;
                _this.dataChannel.binaryType = 'arraybuffer';
                if (_this.dataChannel.readyState === RTC_OPEN) {
                    _this.ondatachannelready();
                }
                else {
                    _this.dataChannel.onopen = function () {
                        _this.ondatachannelready();
                    };
                }
            };
            _this.ondatachannelready = function () {
                _this.externalPromise.resolve(_this.dataChannel);
                _this.dataChannel.send(READY);
            };
            return _this;
        }
        ClientPeerWrapper.prototype.initDataChannel = function () {
            this.peer.ondatachannel = this.ondatachannel;
            return this.externalPromise.promise;
        };
        return ClientPeerWrapper;
    }(BasePeerWrapper));
    exports.ClientPeerWrapper = ClientPeerWrapper;
});
//# sourceMappingURL=peerwrapper.js.map