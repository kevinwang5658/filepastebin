module.exports = { contents: "(function (factory) {\n    if (typeof module === \"object\" && typeof module.exports === \"object\") {\n        var v = factory(require, exports);\n        if (v !== undefined) module.exports = v;\n    }\n    else if (typeof define === \"function\" && define.amd) {\n        define([\"require\", \"exports\"], factory);\n    }\n})(function (require, exports) {\n    \"use strict\";\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    var ExternalPromise = /** @class */ (function () {\n        function ExternalPromise() {\n            var _this = this;\n            this.promise = new Promise(function (resolve, reject) {\n                _this.resolve = resolve;\n                _this.reject = reject;\n            });\n        }\n        return ExternalPromise;\n    }());\n    exports.ExternalPromise = ExternalPromise;\n});\n//# sourceMappingURL=externalpromise.js.map",
dependencies: [],
sourceMap: {},
headerContent: undefined,
mtime: 1553221562131,
devLibsRequired : undefined,
ac : undefined,
_ : {}
}
