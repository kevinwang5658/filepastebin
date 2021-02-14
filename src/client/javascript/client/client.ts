'use strict';

import * as io from "socket.io-client";
import {ClientNetworkManager} from "./clientNetworkManager";
import adapter from 'webrtc-adapter';

const client = <HTMLInputElement>document.getElementById('download');
const progress = document.getElementById('progress');
const code = document.getElementById('code');
const reveal = document.getElementById('reveal');
const slide_down = document.getElementById('text-wrapper');
const download_speed = document.getElementById('download-speed');
const file_name = document.getElementById('file-name');
const file_size = document.getElementById('file-size');
const logo = document.getElementById('mini-logo');

const ROOM_ID = code.textContent;
const FILE_NAME = file_name.textContent;
const FILE_SIZE = Number(file_size.textContent);

const socket = io.connect();

const socketManager = new ClientNetworkManager(socket, ROOM_ID);

console.log(adapter.browserDetails.browser);

//******************************
// Document events
//******************************

client.addEventListener('click', () => {
  client.disabled = true;
  client.style.background = "#62A4F0";

  reveal.style.transform = 'translate(0px, 60px';
  slide_down.style.transform = 'translate(0px, 200px)';
  setTimeout( ()=> {
    reveal.style.visibility = 'visible';
  }, 750);

  socketManager.requestDownload()
});

socketManager.onProgressChangedCallback = (num: number) => {
  progress.innerText = `${Math.min(num, 100).toFixed(2)}%`
};

logo.addEventListener('click', () => {
  window.location.href = window.location.origin;
});
