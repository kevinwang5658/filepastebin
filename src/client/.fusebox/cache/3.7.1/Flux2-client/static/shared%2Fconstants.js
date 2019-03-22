module.exports = { contents: "\"use strict\";\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar A = /** @class */ (function () {\n    function A() {\n    }\n    return A;\n}());\nexports.A = A;\nvar Constants;\n(function (Constants) {\n    //***********************\n    // SocketIO lifecycle\n    //***********************\n    Constants.CONNECT = 'connect';\n    Constants.DISCONNECT = 'disconnect';\n    Constants.ERROR = 'error';\n    Constants.MESSAGE = 'message';\n    //********************\n    // RTC host requests\n    //*********************\n    Constants.REQUEST_HOST = 'request-host';\n    Constants.REQUEST_HOST_ACCEPTED = 'request-host-accepted';\n    //**********************\n    // RTC client requests\n    //**********************\n    Constants.REQUEST_CLIENT = 'request-client';\n    Constants.REQUEST_CLIENT_ACCEPTED = 'request-client-accepted';\n    //************************\n    // RTC Constants\n    //*********************\n    Constants.BYTES_PER_CHUNK = 15000;\n    Constants.MAX_BUFFER = 100 * 1024;\n    Constants.NUMBER_WORKERS = 10;\n    Constants.RTC_OPEN = 'open';\n    Constants.RTC_INIT_TIMEOUT = 5000;\n    Constants.PeerConfiguration = {\n        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]\n    };\n    //***********************\n    // Socket Constants\n    //************************\n    Constants.DATA = 'data';\n    //***********************\n    // Channel Constants\n    //************************\n    // client =====> host\n    Constants.READY = 'ready';\n    // bytes are sent\n    // host =====> client\n    Constants.EOF = 'eof';\n})(Constants = exports.Constants || (exports.Constants = {}));\n",
dependencies: [],
sourceMap: {},
headerContent: undefined,
mtime: 1553219267146,
devLibsRequired : undefined,
ac : undefined,
_ : {}
}
