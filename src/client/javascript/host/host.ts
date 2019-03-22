'use strict';

import * as SocketIO from "socket.io";

import {HostSocketManager} from "./hostsocketmanager";
import {Constants} from "../../../shared/constants.js";
import * as io from "socket.io-client";
import CONNECT = Constants.CONNECT;
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import Socket = SocketIOClient.Socket;

const inp_element = <HTMLInputElement> document.getElementById('in');
const join_room_button = <HTMLDivElement> document.getElementById('join-room-button');
const code_element = document.getElementById('code');
const paste = <HTMLInputElement>document.getElementById('paste');
const share_url = document.getElementById('share-url');
const center_initial = document.getElementById("initial-wrapper");
const center_host = document.getElementById("host-wrapper");
const file_name = document.getElementById("file-name");
const client_connected_number = document.getElementById("device-connected-number");

const dialog_container = <HTMLDivElement> document.getElementById('dialog-container');
const dialog_box = <HTMLDivElement> document.getElementById('dialog');
const dialog_code = <HTMLHeadingElement> document.getElementById('dialog-code');
const dialog_description = <HTMLParagraphElement> document.getElementById('dialog-description');
const dialog_loading_spinner = <HTMLDivElement> document.getElementById('dialog-loading-spinner');
const dialog_back = <HTMLDivElement> document.getElementById('dialog-cancel');

let file: File;
let socket: Socket;
let socketManager: HostSocketManager;

//******************************************
// Page Events
//*******************************************

paste.addEventListener('click', (e) => {
    e.preventDefault();

    paste.disabled = true;
    paste.innerHTML = "<div class=\"lds-ring\"><div></div><div></div><div></div><div></div></div>";
    paste.style.background = "#62A4F0";

    socket = io.connect();
    socketManager = new HostSocketManager(socket, file);
    socketManager.hostacceptedcallback = onRoomCreated
});

inp_element.addEventListener('change', () => {
    if (inp_element.files[0] && inp_element.files[0].name !== '') {
        paste.disabled = false;

        file = inp_element.files[0];
        let filename = inp_element.files[0].name;
        document.getElementById("in-label").innerHTML = filename.fontcolor("#4A4A4A");
    }
});

join_room_button.addEventListener('click', (ev: Event) => {
    dialog_container.style.display = 'flex';

});

function onRoomCreated(response: RequestHostAcceptedModel) {
    dialog_code.innerText = response.roomId;
    dialog_container.style.display = 'flex';
}

dialog_back.addEventListener('click', (ev) => {
    paste.disabled = false;
    paste.innerText = "Paste It";
    paste.style.background = '#297FE2';
    socket.disconnect();

    dialog_container.style.display = 'none';
});

/*let cleave = new Cleave('.room-input', {
    numeral: true,
    numeralThousandsGroupStyle: 'none',
    numeralIntegerScale: 6,
});*/