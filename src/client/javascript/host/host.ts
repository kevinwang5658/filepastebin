'use strict';

import adapter from 'webrtc-adapter';
import { DialogManager } from './components/dialogs/dialog-manager';
import { FileInputRenderer } from './components/file-input/file-input-renderer';
import { fetchRoomIdFromCode } from './join-room-request';
import { HostNetworkManager } from './network/host-network-manager';
import { SignalingSocket } from '../signaling/signaling-socket';

const join_room_button = document.getElementById('join-room-button') as HTMLDivElement;
const paste = document.getElementById('paste') as HTMLButtonElement;

let signalingSocket: SignalingSocket | null = null;

const dialogManager = new DialogManager();
const fileInputRenderer = new FileInputRenderer();

console.log(adapter.browserDetails.browser);

paste.addEventListener('click', async (e) => {
  e.preventDefault();

  paste.disabled = true;
  paste.innerHTML = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
  paste.style.background = '#62A4F0';

  const files = fileInputRenderer.getFileList();
  const fileDescriptions = files.map(f => ({
    fileName: f.name,
    fileSize: f.size,
    fileType: f.type,
  }));

  try {
    const res = await fetch(`${__SERVER_URL__}/api/room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: fileDescriptions }),
    });

    if (!res.ok) throw new Error('Failed to create room');

    const { roomId, roomCode, iceServers } = await res.json() as { roomId: string; roomCode: string; iceServers: RTCIceServer[] };

    const wsUrl = `${__SERVER_URL__ || window.location.origin}/room/${roomId}/ws?role=host`;
    signalingSocket = new SignalingSocket(wsUrl);
    const socketManager = new HostNetworkManager(signalingSocket, files, iceServers ?? []);

    dialogManager.showHostDialog(roomCode, socketManager, () => {
      paste.disabled = false;
      paste.innerText = 'Paste It';
      paste.style.background = '#297FE2';
      signalingSocket?.close();
      signalingSocket = null;
    });
  } catch (err) {
    console.error('Failed to start session:', err);
    paste.disabled = false;
    paste.innerText = 'Paste It';
    paste.style.background = '#297FE2';
  }
});

join_room_button.addEventListener('click', (_) => {
  dialogManager.showJoinDialog(fetchRoomIdFromCode, (roomId: string) => {
    window.location.href = window.location.origin + '/' + roomId;
  });
});
