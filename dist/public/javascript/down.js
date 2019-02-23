'use strict';

const down = document.getElementById('down');
const progress = document.getElementById('progress');
const code = document.getElementById('code');
const file_name = document.getElementById('file_name');

const SESSION = code.textContent;

//******************************
// Document events
//******************************

down.addEventListener('click', () => {
  down.disabled = true;

  rtcInitialize()
});

//************************
// Socket.io
//**********************

let socket = io.connect();

socket.on('connect', () => {
  console.log('Connected to socket');

  socket.emit('request_join', SESSION);
});

socket.on('client_joined', () => {
  console.log('Client joined');

  down.disabled = false;
});

socket.on('message', (message) => {
  switch(message.type) {
    case 'signal':
      handleSignalMessage(message);
      break;
  }
});

socket.on('error', (err) => {
  console.error(err);
});

socket.on('exception', (error) => {
  alert(error);
});

socket.on('disconnect', (reason) => console.log('Disconnected for ' + reason));

let sendIceCandidate = (content) => socket.send(Message('signal', 'icecandidate', content));

let sendOffer = (content) => socket.send(Message('signal', 'offer', content));

let sendAnswer = (content) => socket.send(Message('signal', 'answer', content));

let requestDownload = () => socket.send(Message('request', 'download'));

//***************
// RTC
//***************

//weird for ios, trickle must be false and turn must be set in order to work as of iOS 12
const config = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    }]
};

const peer = new RTCPeerConnection(config);

let dataChannel;
let isNegotiating = false;

function handleSignalMessage(message) {
  console.log('Got: ' + JSON.stringify(message));

  try {
    switch (message.action) {
      case 'icecandidate':
        peer.addIceCandidate(new RTCIceCandidate(message.content)).catch((err) => console.error(err));
        break;
      case 'offer':
        if (message.content !== null) {
          peer.setRemoteDescription(message.content).catch((err) => console.error(err));
          rtcCreateAnswer();
        }
        break;
      case 'answer':
        if (message.content !== null) {
          peer.setRemoteDescription(message.content).then((desc) => {
            console.log('Answer set')
          }).catch((err) => console.log(err));
        }
        break;
    }
  } catch (err) {
    console.error(err)
  }
}

peer.onsignalingstatechange = (event) => {
  console.log('Signaling state changed: ' + peer.signalingState);

  isNegotiating = (peer.signalingState !== 'stable');
};

peer.onconnectionstatechange = (event) => console.log('Conenction state changed to: ' + peer.connectionState);

peer.onicecandidateerror = (err) => console.log('Ice candidate error: ' + JSON.stringify(err));

peer.onicecandidate = (event) => {
  console.log('Ice Candidate: ' + JSON.stringify(event)); if (event.hasOwnProperty('candidate')) { sendIceCandidate(event.candidate); }};

peer.ondatachannel = (event) => {
  dataChannel = event.channel;
  dataChannel.binaryType = 'arraybuffer';
  rtcSetupDataChannel(dataChannel)
};

peer.onnegotiationneeded = (event) => {
  console.log('Negotiation');

  if (isNegotiating) return;

  isNegotiating = true;
  rtcCreateOffer();
};

function rtcInitialize(){
  dataChannel = [];
  for (let counter = 0; counter < 5; counter++) {
    dataChannel[counter] = peer.createDataChannel(counter.toString(12));
    dataChannel[counter].binaryType = 'arraybuffer';
    rtcSetupDataChannel(dataChannel[counter]);
  }
}

function rtcSetupDataChannel(channel) {
  channel.onopen = () => {
    console.log('Channel opened');
    run(channel);
    requestDownload()
  };
  channel.onclose = () => console.log('Channel closed');
}

let rtcCreateOffer = () => peer.createOffer()
  .then((desc) => {
    //desc.sdp = desc.sdp.replace( 'b=AS:30', 'b=AS:1638400' );
    return peer.setLocalDescription(desc)
  }).then((desc)=> {
    sendOffer(peer.localDescription)
  }).catch((err) => console.error(err));

let rtcCreateAnswer = () => peer.createAnswer()
  .then((desc) => {
    //desc.sdp = desc.sdp.replace( 'b=AS:30', 'b=AS:1638400' );
    return peer.setLocalDescription(desc);
  }).then((desc) => {
    sendAnswer(peer.localDescription)
  }).catch((err) => console.error(err));

//*****************************************
// Models
//*******************************************

function Message(type, action, content) {
  return {
    type: type,
    action: action,
    content: content
  }
}

//****************************
// File API
//**************************

var incomingFileInfo;
var incomingFileData;
var bytesReceived;
var inProgress = false;

let stime = 0;

function run(dataConn) {
  dataConn.onmessage = (event) => {
    //console.log('message');
    if (inProgress === false) {
      startDownload(event.data);
    } else {
      progressDownload(event.data);
    }
  };

  function startDownload(data) {
    stime = Date.now();
    console.log(data.toString());
    incomingFileInfo = JSON.parse(data.toString());
    incomingFileData = [];
    bytesReceived = 0;
    inProgress = true;
    console.log('incoming file <b>' + incomingFileInfo.fileName + '</b> size: ' + incomingFileInfo.fileSize);
  }

  function progressDownload(data) {
    bytesReceived += data.byteLength;
    incomingFileData.push(data);
    progress.innerText = ((bytesReceived / incomingFileInfo.fileSize) * 100).toFixed(2) + '%';

    if (bytesReceived === incomingFileInfo.fileSize) {
      endDownload()
    }
  }

  function endDownload() {
    let etime = Date.now();
    console.log(incomingFileInfo.fileSize);
    console.log((etime - stime) * 1000);
    inProgress = false;
    var blob = new Blob(incomingFileData, {
      type: incomingFileInfo.type
    });

    download(blob, incomingFileInfo.fileName, incomingFileInfo.fileType)
  }
}
