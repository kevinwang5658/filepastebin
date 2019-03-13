'use strict';

import * as SocketIO from "socket.io";

import {HostSocketManager} from "./hostsocketmanager";
import {Constants} from "../../../shared/constants";
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import {Socket} from "socket.io";
import CONNECT = Constants.CONNECT;

const inp_element = <HTMLInputElement>document.getElementById('in');
const inp_element_label = document.getElementById("in_label");
const code_element = document.getElementById('code');
const paste = <HTMLInputElement>document.getElementById('paste');
const share_url = document.getElementById('share-url');
const center_initial = document.getElementById("initial-wrapper");
const center_host = document.getElementById("host-wrapper");
const file_name = document.getElementById("file-name");
const client_connected_number = document.getElementById("device-connected-number");

declare const io: any;

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

function onRoomCreated(response: RequestHostAcceptedModel) {
    share_url.innerText = window.location + response.roomId;
    code_element.innerText = response.roomId;
    file_name.innerText = response.fileName;

    center_initial.style.display = 'none';
    center_host.style.display = 'flex';
}