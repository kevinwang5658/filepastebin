import { io, Socket } from 'socket.io-client';
import adapter from 'webrtc-adapter';
import { ClientNetworkManager } from './client-network-manager';
import { DownloadPanelRenderer } from './components/download-panel-renderer';

declare const FILES_LIST: string;
declare const ROOM_CODE: string;

const filesList = JSON.parse(unescape(FILES_LIST));
const roomCode = unescape(ROOM_CODE);

const downloadPanel = new DownloadPanelRenderer(filesList);
const socket: Socket = io();
const clientNetworkManager = new ClientNetworkManager(socket, roomCode);

console.log(adapter.browserDetails.browser);

//******************************
// Document events
//******************************

downloadPanel.setOnDownloadClickedCallback(() => {
  clientNetworkManager.requestDownload();
});

clientNetworkManager.onProgressChangedCallback = (progress: number[]) => {
  downloadPanel.updateProgress(progress);
};
