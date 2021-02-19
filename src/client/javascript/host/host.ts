'use strict';

import {HostNetworkManager} from "./network/hostNetworkManager";
import {Constants} from "../../../shared/constants";
import * as io from "socket.io-client";
import CONNECT = Constants.CONNECT;
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import Socket = SocketIOClient.Socket;
import {DialogManager} from "./components/dialogmanager";
import {requestJoinRoom} from "./joinRoomRequest";
import adapter from 'webrtc-adapter';
import {FileInputRenderer} from "./components/file-input/fileInputRenderer";

const container = <HTMLDivElement> document.getElementById('container');
const join_room_button = <HTMLDivElement> document.getElementById('join-room-button');
const paste = <HTMLButtonElement>document.getElementById('paste');

let socket: Socket;
let socketManager: HostNetworkManager;

let dialogManager = new DialogManager();
let fileInputRenderer = new FileInputRenderer();

console.log(adapter.browserDetails.browser);

//******************************************
// Page Events
//*******************************************

paste.addEventListener('click', (e) => {
    e.preventDefault();

    paste.disabled = true;
    paste.innerHTML = "<div class=\"lds-ring\"><div></div><div></div><div></div><div></div></div>";
    paste.style.background = "#62A4F0";

    socket = io.connect();
    socketManager = new HostNetworkManager(socket, fileInputRenderer.getFileList());
    socketManager.onRoomCreatedCallback = onRoomCreated
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
}
