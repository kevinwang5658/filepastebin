'use strict';

import {HostSocketManager} from "./webrtc/hostsocketmanager";
import {Constants} from "../../../shared/constants";
import * as io from "socket.io-client";
import CONNECT = Constants.CONNECT;
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import Socket = SocketIOClient.Socket;
import {DialogManager} from "./components/dialogmanager";
import {requestJoinRoom} from "./JoinRoomRequest";
import adapter from 'webrtc-adapter';

const container = <HTMLDivElement> document.getElementById('container');
const file_input_element = <HTMLInputElement> document.getElementById('in');
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

let selectedFiles: File[] = []
let socket: Socket;
let socketManager: HostSocketManager;

let dialogManager = new DialogManager();

//******************************************
// Page Events
//*******************************************

paste.addEventListener('click', (e) => {
    e.preventDefault();

    paste.disabled = true;
    paste.innerHTML = "<div class=\"lds-ring\"><div></div><div></div><div></div><div></div></div>";
    paste.style.background = "#62A4F0";

    socket = io.connect();
    socketManager = new HostSocketManager(socket, selectedFiles);
    socketManager.hostacceptedcallback = onRoomCreated
});

file_input_element.addEventListener('change', () => {
    if (file_input_element.files.length != 0) {
        console.log(file_input_element.files)
        filesAdded(file_input_element.files)
    }
});

join_room_button.addEventListener('click', (ev: Event) => {
    dialogManager.showJoinDialog(requestJoinRoom, (roomId: string) => {
        window.location.href = window.location.href + roomId;
    })
});

// Drag and Drop

container.addEventListener('drop', (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    container.style.background = '#FFFFFF';

    if (ev.dataTransfer && ev.dataTransfer.files[0] && ev.dataTransfer.files[0].name !== '') {
        filesAdded(ev.dataTransfer.files)
    }
});

container.addEventListener('dragover', (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    container.style.background = '#F4F4F4'
});

let drag_count = 0;

container.addEventListener('dragenter', (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    drag_count++;
    container.style.background = '#F4F4F4'
});

container.addEventListener('dragleave', (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    drag_count--;

    if (drag_count == 0) {
        container.style.background = '#FFFFFF';
    }
});

function onRoomCreated(response: RequestHostAcceptedModel) {
    dialogManager.showHostDialog(response.roomId, () => {
        paste.disabled = false;
        paste.innerText = "Paste It";
        paste.style.background = '#297FE2';
        socket.disconnect();
    })
}

function filesAdded(files: FileList) {
    paste.disabled = false;

    selectedFiles.push(...Array.from(files));

    document.getElementById("in-label").innerHTML = files[0].name.fontcolor("#4A4A4A");
}
