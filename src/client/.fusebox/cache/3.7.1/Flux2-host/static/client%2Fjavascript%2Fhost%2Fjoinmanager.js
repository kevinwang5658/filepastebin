module.exports = { contents: "\"use strict\";\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar constants_1 = require(\"../../../shared/constants\");\nvar REQUEST_JOIN_ROOM = constants_1.Constants.REQUEST_JOIN_ROOM;\nvar JoinManager = /** @class */ (function () {\n    function JoinManager() {\n    }\n    JoinManager.prototype.requestJoin = function (roomId) {\n        return new Promise(function (resolve, reject) {\n            var xhttp = new XMLHttpRequest();\n            xhttp.onreadystatechange = function () {\n                if (this.readyState === 4 && this.status === 200) {\n                    resolve(this.response === \"true\");\n                }\n            };\n            xhttp.onerror = function () { return reject(); };\n            xhttp.open(\"GET\", REQUEST_JOIN_ROOM + roomId, true);\n            xhttp.send();\n        });\n    };\n    return JoinManager;\n}());\nexports.JoinManager = JoinManager;\n",
dependencies: ["../../../shared/constants"],
sourceMap: {},
headerContent: undefined,
mtime: 1553301379321,
devLibsRequired : undefined,
ac : undefined,
_ : {}
}
