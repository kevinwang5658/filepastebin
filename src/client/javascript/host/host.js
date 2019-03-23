(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./hostsocketmanager"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var hostsocketmanager_1 = require("./hostsocketmanager");
    var inp_element = document.getElementById('in');
    var join_room_button = document.getElementById('join-room-button');
    var code_element = document.getElementById('code');
    var paste = document.getElementById('paste');
    var share_url = document.getElementById('share-url');
    var center_initial = document.getElementById("initial-wrapper");
    var center_host = document.getElementById("host-wrapper");
    var file_name = document.getElementById("file-name");
    var client_connected_number = document.getElementById("device-connected-number");
    var dialog_container = document.getElementById('dialog-container');
    var dialog_box = document.getElementById('dialog');
    var dialog_code = document.getElementById('dialog-code');
    var dialog_description = document.getElementById('dialog-description');
    var dialog_loading_spinner = document.getElementById('dialog-loading-spinner');
    var dialog_back = document.getElementById('dialog-back');
    var file;
    var socket;
    var socketManager;
    //******************************************
    // Page Events
    //*******************************************
    paste.addEventListener('click', function (e) {
        e.preventDefault();
        paste.disabled = true;
        paste.innerHTML = "<div class=\"lds-ring\"><div></div><div></div><div></div><div></div></div>";
        paste.style.background = "#62A4F0";
        socket = io.connect();
        socketManager = new hostsocketmanager_1.HostSocketManager(socket, file);
        socketManager.hostacceptedcallback = onRoomCreated;
    });
    inp_element.addEventListener('change', function () {
        if (inp_element.files[0] && inp_element.files[0].name !== '') {
            paste.disabled = false;
            file = inp_element.files[0];
            var filename = inp_element.files[0].name;
            document.getElementById("in-label").innerHTML = filename.fontcolor("#4A4A4A");
        }
    });
    join_room_button.addEventListener('click', function (ev) {
        dialog_container.style.display = 'flex';
    });
    function onRoomCreated(response) {
        dialog_code.innerText = response.roomId;
        dialog_container.style.display = 'flex';
    }
    dialog_back.addEventListener('click', function (ev) {
        paste.disabled = false;
        paste.innerText = "Paste It";
        paste.style.background = '#297FE2';
        socket.disconnect(true);
        dialog_container.style.display = 'none';
    });
});
/*let cleave = new Cleave('.room-input', {
    numeral: true,
    numeralThousandsGroupStyle: 'none',
    numeralIntegerScale: 6,
});*/ 
//# sourceMappingURL=host.js.map