(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./clientsocketmanager"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var clientsocketmanager_1 = require("./clientsocketmanager");
    var client = document.getElementById('download');
    var progress = document.getElementById('progress');
    var code = document.getElementById('code');
    var reveal = document.getElementById('reveal');
    var slide_down = document.getElementById('text-wrapper');
    var download_speed = document.getElementById('download-speed');
    var file_name = document.getElementById('file-name');
    var file_size = document.getElementById('file-size');
    var ROOM_ID = code.textContent;
    var FILE_NAME = file_name.textContent;
    var FILE_SIZE = Number(file_size.textContent);
    var socket = io.connect();
    var socketManager = new clientsocketmanager_1.ClientSocketManager(socket, ROOM_ID);
    //******************************
    // Document events
    //******************************
    client.addEventListener('click', function () {
        client.disabled = true;
        client.style.background = "#62A4F0";
        reveal.style.transform = 'translate(0px, 60px';
        slide_down.style.transform = 'translate(0px, 200px)';
        setTimeout(function () {
            reveal.style.visibility = 'visible';
        }, 750);
        socketManager.requestDownload();
    });
    socketManager.onprogresschanged = function (num) {
        progress.innerText = num.toFixed(2) + "%";
    };
});
//# sourceMappingURL=client.js.map