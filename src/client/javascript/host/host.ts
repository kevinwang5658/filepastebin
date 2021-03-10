'use strict';

import {HostNetworkManager} from "./network/hostNetworkManager";
import {Constants} from "../../../shared/constants";
import * as io from "socket.io-client";
import CONNECT = Constants.CONNECT;
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import Socket = SocketIOClient.Socket;
import {DialogManager} from "./components/dialogManager";
import {requestJoinRoom} from "./joinRoomRequest";
import adapter from 'webrtc-adapter';
import {FileInputRenderer} from "./components/file-input/fileInputRenderer";

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

function onRoomCreated(response: RequestHostAcceptedModel) {
    dialogManager.showHostDialog(response.roomId, () => {
        paste.disabled = false;
        paste.innerText = "Paste It";
        paste.style.background = '#297FE2';
        socket.disconnect();
    })
}
