'use strict';

import { Socket } from 'socket.io-client';
import * as io from 'socket.io-client';
import adapter from 'webrtc-adapter';
import { Constants } from '../constants';
import { DialogManager } from './components/dialogs/dialog-manager';
import { FileInputRenderer } from './components/file-input/file-input-renderer';
import { fetchRoomIdFromCode } from './join-room-request';
import { HostNetworkManager } from './network/host-network-manager';
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;

const join_room_button = <HTMLDivElement>document.getElementById('join-room-button');
const paste = <HTMLButtonElement>document.getElementById('paste');

let socket: Socket;
let socketManager: HostNetworkManager;

const dialogManager = new DialogManager();
const fileInputRenderer = new FileInputRenderer();

console.log(adapter.browserDetails.browser);

//******************************************
// Page Events
//*******************************************

paste.addEventListener('click', (e) => {
  e.preventDefault();

  paste.disabled = true;
  paste.innerHTML = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
  paste.style.background = '#62A4F0';

  socket = io.connect();
  socketManager = new HostNetworkManager(socket, fileInputRenderer.getFileList());
  socketManager.onRoomCreatedCallback = onRoomCreated;
});

join_room_button.addEventListener('click', (_) => {
  dialogManager.showJoinDialog(fetchRoomIdFromCode, (roomId: string) => {
    window.location.href = window.location.href + roomId;
  });
});

function onRoomCreated(response: RequestHostAcceptedModel, hostNetworkManager: HostNetworkManager): void {
  dialogManager.showHostDialog(response.roomCode, hostNetworkManager, () => {
    paste.disabled = false;
    paste.innerText = 'Paste It';
    paste.style.background = '#297FE2';
    socket.disconnect();
  });
}
