module.exports = { contents: "(function (factory) {\n    if (typeof module === \"object\" && typeof module.exports === \"object\") {\n        var v = factory(require, exports);\n        if (v !== undefined) module.exports = v;\n    }\n    else if (typeof define === \"function\" && define.amd) {\n        define([\"require\", \"exports\", \"../../../shared/constants\", \"./hostpeermanager\"], factory);\n    }\n})(function (require, exports) {\n    \"use strict\";\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    var constants_1 = require(\"../../../shared/constants\");\n    var MESSAGE = constants_1.Constants.MESSAGE;\n    var DISCONNECT = constants_1.Constants.DISCONNECT;\n    var ERROR = constants_1.Constants.ERROR;\n    var REQUEST_HOST_ACCEPTED = constants_1.Constants.REQUEST_HOST_ACCEPTED;\n    var hostpeermanager_1 = require(\"./hostpeermanager\");\n    var HostSocketManager = /** @class */ (function () {\n        function HostSocketManager(socket, file) {\n            var _this = this;\n            this.socket = socket;\n            this.file = file;\n            this.requestHost = function () {\n                _this.socket.emit(constants_1.Constants.REQUEST_HOST, {\n                    fileName: _this.file.name,\n                    fileSize: _this.file.size,\n                    fileType: _this.file.type\n                });\n            };\n            this.onhost = function (response) {\n                _this.hostacceptedcallback(response);\n            };\n            this.onmessage = function (message) {\n                _this.peerManager.handleMessage(message);\n            };\n            socket.on(DISCONNECT, function (reason) { return console.log(reason); });\n            socket.on(ERROR, function (err) { return console.log(err); });\n            socket.on(REQUEST_HOST_ACCEPTED, this.onhost);\n            socket.on(MESSAGE, this.onmessage);\n            this.peerManager = new hostpeermanager_1.HostPeerManager(socket, file);\n            this.requestHost();\n        }\n        return HostSocketManager;\n    }());\n    exports.HostSocketManager = HostSocketManager;\n});\n//# sourceMappingURL=hostsocketmanager.js.map",
dependencies: ["../../../shared/constants","./hostpeermanager"],
sourceMap: {},
headerContent: undefined,
mtime: 1553221562263,
devLibsRequired : undefined,
ac : undefined,
_ : {}
}
