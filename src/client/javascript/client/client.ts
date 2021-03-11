'use strict';

import * as io from "socket.io-client";
import {ClientNetworkManager} from "./clientNetworkManager";
import adapter from 'webrtc-adapter';
import {DownloadPanelBase} from "./components/downloadPanelBase";
import {DownloadPanelRenderer} from "./components/downloadPanelRenderer";

declare const FILES_LIST: string
declare const ROOM_CODE: string

const logo = document.getElementById('mini-logo');

const filesList = JSON.parse(unescape(FILES_LIST))
const roomCode = unescape(ROOM_CODE)

const downloadPanel = new DownloadPanelRenderer(filesList);
const socket = io.connect();
const clientNetworkManager = new ClientNetworkManager(socket, roomCode);

console.log(adapter.browserDetails.browser);

//******************************
// Document events
//******************************

downloadPanel.setOnDownloadClickedCallback(() => {
  clientNetworkManager.requestDownload()
})

clientNetworkManager.onProgressChangedCallback = (progress: number[]) => {
  downloadPanel.updateProgress(progress);
};
