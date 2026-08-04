import adapter from 'webrtc-adapter';
import { ClientNetworkManager } from './client-network-manager';
import { DownloadPanelRenderer } from './components/download-panel-renderer';
import { SignalingSocket } from '../signaling/signaling-socket';
import { Constants } from '../constants';

const roomId = window.location.pathname.replace(/^\//, '');
const downloadPanel = new DownloadPanelRenderer();

console.log(adapter.browserDetails.browser);

(async () => {
  try {
    const res = await fetch(`${__SERVER_URL__}/api/room/${roomId}/info`);
    if (!res.ok) {
      downloadPanel.showRoomNotFound();
      return;
    }

    const { files, iceServers } = await res.json() as { files: Constants.FileDescription[]; iceServers: RTCIceServer[] };
    downloadPanel.setFiles(files);

    const wsUrl = `${__SERVER_URL__ || window.location.origin}/room/${roomId}/ws?role=client`;
    const signalingSocket = new SignalingSocket(wsUrl);
    const clientNetworkManager = new ClientNetworkManager(signalingSocket, files, iceServers ?? []);

    clientNetworkManager.onProgressChangedCallback = (progress) => {
      downloadPanel.updateProgress(progress);
    };

    clientNetworkManager.onHostDisconnected = () => {
      downloadPanel.showRoomNotFound();
    };

    clientNetworkManager.onTransferFailed = () => {
      downloadPanel.showTransferFailed();
    };

    downloadPanel.setOnDownloadClickedCallback(() => {
      clientNetworkManager.requestDownload();
    });
  } catch (err) {
    console.error('Failed to load room:', err);
    downloadPanel.showRoomNotFound();
  }
})();
