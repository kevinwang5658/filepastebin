'use strict';

import { HostNetworkManager } from "./network/host-network-manager";
import { Constants } from "../../../shared/constants";
import * as io from "socket.io-client";
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import Socket = SocketIOClient.Socket;
import { DialogManager } from "./components/dialog-manager";
import { requestJoinRoom } from "./join-room-request";
import adapter from 'webrtc-adapter';
import { FileInputRenderer } from "./components/file-input/file-input-renderer";

const join_room_button = <HTMLDivElement>document.getElementById('join-room-button');
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

join_room_button.addEventListener('click', (_) => {
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
