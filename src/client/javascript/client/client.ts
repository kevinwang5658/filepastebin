'use strict';

import * as io from "socket.io-client";
import {ClientNetworkManager} from "./clientNetworkManager";
import adapter from 'webrtc-adapter';
import {DownloadPanelBase} from "./components/downloadPanelBase";
import {DownloadPanelRenderer} from "./components/downloadPanelRenderer";

declare const FILES_LIST: string
declare const ROOM_CODE: string

const client = <HTMLInputElement>document.getElementById('download');
const progress = document.getElementById('progress');
const code = document.getElementById('code');
const reveal = document.getElementById('reveal');
const slide_down = document.getElementById('text-wrapper');
const download_speed = document.getElementById('download-speed');
const file_name = document.getElementById('file-name');
const file_size = document.getElementById('file-size');
const logo = document.getElementById('mini-logo');

const filesList = JSON.parse(unescape(FILES_LIST))
const roomCode = unescape(ROOM_CODE)

const downloadPanel = new DownloadPanelRenderer(filesList);
const socket = io.connect();
const socketManager = new ClientNetworkManager(socket, roomCode);

console.log(adapter.browserDetails.browser);


//******************************
// Document events
//******************************

// client.addEventListener('click', () => {
//   client.disabled = true;
//   client.style.background = "#62A4F0";
//
//   reveal.style.transform = 'translate(0px, 60px';
//   slide_down.style.transform = 'translate(0px, 200px)';
//   setTimeout( ()=> {
//     reveal.style.visibility = 'visible';
//   }, 750);
//
//   socketManager.requestDownload()
// });

socketManager.onProgressChangedCallback = (num: number) => {
  progress.innerText = `${Math.min(num, 100).toFixed(2)}%`
};

logo.addEventListener('click', () => {
  window.location.href = window.location.origin;
});
