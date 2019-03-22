(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseManager = /** @class */ (function () {
        function BaseManager(socket) {
            this.socket = socket;
            this.peerList = [];
        }
        return BaseManager;
    }());
    exports.BaseManager = BaseManager;
});
//# sourceMappingURL=basemanager.js.map