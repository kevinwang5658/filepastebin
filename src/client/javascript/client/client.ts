import { io, Socket } from 'socket.io-client';
import adapter from 'webrtc-adapter';
import { ClientNetworkManager } from './client-network-manager';
import { DownloadPanelRenderer } from './components/download-panel-renderer';

const roomId = window.location.pathname.replace(/^\//, '');

const downloadPanel = new DownloadPanelRenderer();
const socket: Socket = io(__SERVER_URL__);
const clientNetworkManager = new ClientNetworkManager(socket, roomId);

console.log(adapter.browserDetails.browser);

downloadPanel.setOnDownloadClickedCallback(() => {
  clientNetworkManager.requestDownload();
});

clientNetworkManager.onProgressChangedCallback = (progress: number[]) => {
  downloadPanel.updateProgress(progress);
};

clientNetworkManager.onFilesReceived = (files) => {
  downloadPanel.setFiles(files);
};

clientNetworkManager.onRoomNotFound = () => {
  downloadPanel.showRoomNotFound();
};
