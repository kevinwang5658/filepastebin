'use strict';

import * as SocketIO from "socket.io";

const inp_element = <HTMLInputElement>document.getElementById('in');
const inp_element_label = document.getElementById("in_label");
const code_element = document.getElementById('code');
const paste = <HTMLInputElement>document.getElementById('paste');
const share_url = document.getElementById('share-url');
const center_initial = document.getElementById("initial-wrapper");
const center_host = document.getElementById("host-wrapper");
const file_name = document.getElementById("file-name");
const client_connected_number = document.getElementById("device-connected-number");

import {Constants} from "../../shared/constants";
import {Socket} from "socket.io";
declare const io: any;

//******************************************
// Page Events
//*******************************************

paste.addEventListener('click', (e) => {
    e.preventDefault();

    socketInitialize(inp_element.files[0]);
    paste.disabled = true;
    paste.innerHTML = "<div class=\"lds-ring\"><div></div><div></div><div></div><div></div></div>";
    paste.style.background = "#62A4F0";
});

inp_element.addEventListener('change', () => {
    if (inp_element.files[0] && inp_element.files[0].name !== '') {
        paste.disabled = false;

        let filename = inp_element.files[0].name;
        inp_element_label.innerHTML = filename.fontcolor("#4A4A4A");
    }
});

function socketInitialize(file) {

    //************************
    // Socket
    //************************

    let socket: Socket = io.connect();

    socket.on(Constants.CONNECT, () => {
        console.log('Connected to Socket');
        socket.emit(Constants.REQUEST_HOST, <Constants.RequestHostRequestModel>{
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        })
    });

    socket.on(Constants.REQUEST_HOST_ACCEPTED, (session) => {
        console.log('Created room: ' + session);
        share_url.innerText = window.location + session;
        code_element.innerText = session;
        file_name.innerText = file.name;

        center_initial.style.display = 'none';
        center_host.style.display = 'flex';
    });

    socket.on('client_connected', (num) => {
        client_connected_number.innerText = num;
    });

    socket.on('disconnect', (reason) => console.log(`Disconnected from Socket: ${reason}`));

    socket.on('error', (error) => console.log('error', error));

    socket.on('exception', (error) => {
        alert(error);
    });

    socket.on('message', (message) => {
        switch (message.type) {
            case 'signal':
                handleSignalMessage(message);
                break;
        }
    });

    let sendIceCandidate = (content) => socket.send(Message('signal', 'icecandidate', content));

    let sendOffer = (content) => socket.send(Message('signal', 'offer', content));

    let sendAnswer = (content) => socket.send(Message('signal', 'answer', content));

    //*************************************
// RTC
//*************************************

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
        rtcSetupDataChannel(dataChannel);
    };

    peer.onnegotiationneeded = (event) => {
        console.log('Negotiation');

        if (isNegotiating) return;

        isNegotiating = true;
        rtcCreateOffer();
    };

    function rtcSetupDataChannel(channel) {
        channel.onopen = () => {
            console.log('Channel opened');
            send(channel)
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

//*********************************
// Models
//********************************

    function Message(type, action, content) {
        return {
            type: type,
            action: action,
            content: content
        }
    }

//*******************************
// File API
//*******************************

    var currentChunk = 0;
    const BYTES_PER_CHUNK = 15000;

    const fileReader = new FileReader();

    const readAsArrayBuffer = (reader, file) => {
        return new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);

            reader.onerror = reject;

            reader.readAsArrayBuffer(file)
        })
    };

    const bufferedAmountLow = (channel) => {
        return new Promise((resolve, reject) => {
            try {
                bufferAmountLowTimer(resolve, channel);
                channel.addEventListener('bufferedamountlow', () => resolve(), {once: true});
            } catch(err) {
                console.log(err);
                reject();
            }
        })
    };

    function bufferAmountLowTimer(resolve, channel) {
        setTimeout(() => {
            if (channel.bufferedAmount > BYTES_PER_CHUNK) {
                bufferedAmountLow(channel)
            }  else {
                resolve()
            }
        }, 1000);
    }

    const MAX = 100 * 1024;

    function send(dataConn) {
        console.log('send file');
        currentChunk = 0;
        dataConn.send(JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        }));
        dataConn.bufferedAmountLowThreshold = BYTES_PER_CHUNK;
        sendFiles(dataConn);
    }

    async function sendFiles(dataConn) {

        while(currentChunk * BYTES_PER_CHUNK < file.size) {
            if (dataConn.bufferedAmount > MAX) {
                await bufferedAmountLow(dataConn)
            }

            var start = BYTES_PER_CHUNK * currentChunk;
            var end = Math.min(file.size, start + BYTES_PER_CHUNK);

            await readAsArrayBuffer(fileReader, file.slice(start, end));
            dataConn.send(fileReader.result);

            currentChunk++;
        }
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

/*function initiator() {
  var peer = new window.SimplePeer({
    initiator: true,


    trickle:false,
  });

  peer.on('signal', function(data) {
    if ('type' in data) {
      socket.emit('rtc-connect', {
        code: code,
        data: data
      });
    }
  });

  socket.on('rtc-connect-response', (data) => {
    console.log(data);
    peer.signal(data.data);
    socket.emit('yougonext', {
      code: data.sender,
      sender: code
    })
  });

  peer.on('connect', () => {
    alert('connected');
    console.log('connected');
  });

  return peer;
}

function noninitiator() {
  let peer = new window.SimplePeer({

    //weird for ios trickle must be false and turn must be set in order to work as of iOS 12 for both clients
    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com'
        }]
    },
    trickle: false,
  });
  let codefield = '';

  document.getElementById('setcode').addEventListener('submit', (e) => {
    e.preventDefault();
    codefield = document.getElementById('codefield').value;
    socket.emit('rtc-connect-request', codefield);
  });

  socket.on('rtc-connect-request', (data) => {
    peer.signal(data)
  });

  peer.on('signal', (data) => {
    console.log(data);
    if ('type' in data) {
      console.log('has data');
      socket.emit('rtc-connect-response', {
        code: codefield,
        data: data,
        sender: code
      });
    }
  });

  socket.on('next', (data) => {
  });

  return peer;
}

var file;
var currentChunk = 0;
const BYTES_PER_CHUNK = 1200;
const fileReader = new FileReader();

var incomingFileInfo;
var incomingFileData;
var bytesReceived;
var inProgress = false;

function run(peer) {
  peer.on('data', (data) => {
    if (inProgress === false) {
      startDownload(data);
    } else {
      progressDownload(data);
    }
  });

  function startDownload(data) {
    incomingFileInfo = JSON.parse(data.toString());
    incomingFileData = [];
    bytesReceived = 0;
    inProgress = true;
    console.log('incoming file <b>' + incomingFileInfo.fileName + '</b> size: ' + incomingFileInfo.fileSize );
  }

  function progressDownload(data) {
    bytesReceived += data.byteLength;
    incomingFileData.push(data);
    console.log('progress: ' + ((bytesReceived / incomingFileInfo.fileSize) * 100).toFixed(2) + '%')
    if (bytesReceived === incomingFileInfo.fileSize) {
      endDownload()
    }
  }

  function endDownload() {
    inProgress = false;
    var blob = new Blob(incomingFileData, {
      type: incomingFileInfo.type
    });

    download(blob, incomingFileInfo.fileName, incomingFileInfo.fileType)
  }

  peer.on('error', (err) => {
    console.log('error', err)
  });

  inp.addEventListener('change', () => {
    file = inp.files[0];

    console.log('send file');
    currentChunk = 0;
    peer.send(JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }));
    readNextChunk();
  });

  function readNextChunk() {
    var start = BYTES_PER_CHUNK * currentChunk;
    var end = Math.min(file.size, start + BYTES_PER_CHUNK);
    fileReader.readAsArrayBuffer(file.slice(start, end));
  }

  fileReader.onload = async function () {
    peer.send(fileReader.result);
    currentChunk++;

    if (BYTES_PER_CHUNK * currentChunk < file.size){
      await sleep(200);
      readNextChunk();
    }
  }
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};*/
