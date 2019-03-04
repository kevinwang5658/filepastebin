(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const code = document.getElementById('code').textContent;
const inp = document.getElementById('in');

//weird for ios trickle must be false and turn must be set in order to work as of iOS 12
const config =  {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
    { urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    }]
};

//************************
// Socket
//************************

var socket = io.connect();

socket.on('connect', (data) => {
  run(initiator());
  run(noninitiator());
});

function initiator() {
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
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2hvbWUva2V2aW4vLm52bS92ZXJzaW9ucy9ub2RlL3YxMS44LjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvamF2YXNjcmlwdC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgY29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlJykudGV4dENvbnRlbnQ7XHJcbmNvbnN0IGlucCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbicpO1xyXG5cclxuLy93ZWlyZCBmb3IgaW9zIHRyaWNrbGUgbXVzdCBiZSBmYWxzZSBhbmQgdHVybiBtdXN0IGJlIHNldCBpbiBvcmRlciB0byB3b3JrIGFzIG9mIGlPUyAxMlxyXG5jb25zdCBjb25maWcgPSAge1xyXG4gIGljZVNlcnZlcnM6IFt7IHVybHM6ICdzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyJyB9LFxyXG4gICAgeyB1cmxzOiAnc3R1bjpnbG9iYWwuc3R1bi50d2lsaW8uY29tOjM0Nzg/dHJhbnNwb3J0PXVkcCcgfSxcclxuICAgIHsgdXJsczogJ3R1cm46bnVtYi52aWFnZW5pZS5jYScsXHJcbiAgICAgIGNyZWRlbnRpYWw6ICdtdWF6a2gnLFxyXG4gICAgICB1c2VybmFtZTogJ3dlYnJ0Y0BsaXZlLmNvbSdcclxuICAgIH1dXHJcbn07XHJcblxyXG4vLyoqKioqKioqKioqKioqKioqKioqKioqKlxyXG4vLyBTb2NrZXRcclxuLy8qKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbnZhciBzb2NrZXQgPSBpby5jb25uZWN0KCk7XHJcblxyXG5zb2NrZXQub24oJ2Nvbm5lY3QnLCAoZGF0YSkgPT4ge1xyXG4gIHJ1bihpbml0aWF0b3IoKSk7XHJcbiAgcnVuKG5vbmluaXRpYXRvcigpKTtcclxufSk7XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBpbml0aWF0b3IoKSB7XHJcbiAgdmFyIHBlZXIgPSBuZXcgd2luZG93LlNpbXBsZVBlZXIoe1xyXG4gICAgaW5pdGlhdG9yOiB0cnVlLFxyXG5cclxuXHJcbiAgICB0cmlja2xlOmZhbHNlLFxyXG4gIH0pO1xyXG5cclxuICBwZWVyLm9uKCdzaWduYWwnLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICBpZiAoJ3R5cGUnIGluIGRhdGEpIHtcclxuICAgICAgc29ja2V0LmVtaXQoJ3J0Yy1jb25uZWN0Jywge1xyXG4gICAgICAgIGNvZGU6IGNvZGUsXHJcbiAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgc29ja2V0Lm9uKCdydGMtY29ubmVjdC1yZXNwb25zZScsIChkYXRhKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgIHBlZXIuc2lnbmFsKGRhdGEuZGF0YSk7XHJcbiAgICBzb2NrZXQuZW1pdCgneW91Z29uZXh0Jywge1xyXG4gICAgICBjb2RlOiBkYXRhLnNlbmRlcixcclxuICAgICAgc2VuZGVyOiBjb2RlXHJcbiAgICB9KVxyXG4gIH0pO1xyXG5cclxuICBwZWVyLm9uKCdjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgYWxlcnQoJ2Nvbm5lY3RlZCcpO1xyXG4gICAgY29uc29sZS5sb2coJ2Nvbm5lY3RlZCcpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gcGVlcjtcclxufVxyXG5cclxuZnVuY3Rpb24gbm9uaW5pdGlhdG9yKCkge1xyXG4gIGxldCBwZWVyID0gbmV3IHdpbmRvdy5TaW1wbGVQZWVyKHtcclxuXHJcbiAgICAvL3dlaXJkIGZvciBpb3MgdHJpY2tsZSBtdXN0IGJlIGZhbHNlIGFuZCB0dXJuIG11c3QgYmUgc2V0IGluIG9yZGVyIHRvIHdvcmsgYXMgb2YgaU9TIDEyIGZvciBib3RoIGNsaWVudHNcclxuICAgIGNvbmZpZzogeyBpY2VTZXJ2ZXJzOiBbeyB1cmxzOiAnc3R1bjpzdHVuLmwuZ29vZ2xlLmNvbToxOTMwMicgfSxcclxuICAgICAgICB7IHVybHM6ICdzdHVuOmdsb2JhbC5zdHVuLnR3aWxpby5jb206MzQ3OD90cmFuc3BvcnQ9dWRwJyB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHVybHM6ICd0dXJuOm51bWIudmlhZ2VuaWUuY2EnLFxyXG4gICAgICAgICAgY3JlZGVudGlhbDogJ211YXpraCcsXHJcbiAgICAgICAgICB1c2VybmFtZTogJ3dlYnJ0Y0BsaXZlLmNvbSdcclxuICAgICAgICB9XVxyXG4gICAgfSxcclxuICAgIHRyaWNrbGU6IGZhbHNlLFxyXG4gIH0pO1xyXG4gIGxldCBjb2RlZmllbGQgPSAnJztcclxuXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldGNvZGUnKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29kZWZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVmaWVsZCcpLnZhbHVlO1xyXG4gICAgc29ja2V0LmVtaXQoJ3J0Yy1jb25uZWN0LXJlcXVlc3QnLCBjb2RlZmllbGQpO1xyXG4gIH0pO1xyXG5cclxuICBzb2NrZXQub24oJ3J0Yy1jb25uZWN0LXJlcXVlc3QnLCAoZGF0YSkgPT4ge1xyXG4gICAgcGVlci5zaWduYWwoZGF0YSlcclxuICB9KTtcclxuXHJcbiAgcGVlci5vbignc2lnbmFsJywgKGRhdGEpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgaWYgKCd0eXBlJyBpbiBkYXRhKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdoYXMgZGF0YScpO1xyXG4gICAgICBzb2NrZXQuZW1pdCgncnRjLWNvbm5lY3QtcmVzcG9uc2UnLCB7XHJcbiAgICAgICAgY29kZTogY29kZWZpZWxkLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgc2VuZGVyOiBjb2RlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBzb2NrZXQub24oJ25leHQnLCAoZGF0YSkgPT4ge1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gcGVlcjtcclxufVxyXG5cclxudmFyIGZpbGU7XHJcbnZhciBjdXJyZW50Q2h1bmsgPSAwO1xyXG5jb25zdCBCWVRFU19QRVJfQ0hVTksgPSAxMjAwO1xyXG5jb25zdCBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbnZhciBpbmNvbWluZ0ZpbGVJbmZvO1xyXG52YXIgaW5jb21pbmdGaWxlRGF0YTtcclxudmFyIGJ5dGVzUmVjZWl2ZWQ7XHJcbnZhciBpblByb2dyZXNzID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiBydW4ocGVlcikge1xyXG4gIHBlZXIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xyXG4gICAgaWYgKGluUHJvZ3Jlc3MgPT09IGZhbHNlKSB7XHJcbiAgICAgIHN0YXJ0RG93bmxvYWQoZGF0YSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwcm9ncmVzc0Rvd25sb2FkKGRhdGEpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBzdGFydERvd25sb2FkKGRhdGEpIHtcclxuICAgIGluY29taW5nRmlsZUluZm8gPSBKU09OLnBhcnNlKGRhdGEudG9TdHJpbmcoKSk7XHJcbiAgICBpbmNvbWluZ0ZpbGVEYXRhID0gW107XHJcbiAgICBieXRlc1JlY2VpdmVkID0gMDtcclxuICAgIGluUHJvZ3Jlc3MgPSB0cnVlO1xyXG4gICAgY29uc29sZS5sb2coJ2luY29taW5nIGZpbGUgPGI+JyArIGluY29taW5nRmlsZUluZm8uZmlsZU5hbWUgKyAnPC9iPiBzaXplOiAnICsgaW5jb21pbmdGaWxlSW5mby5maWxlU2l6ZSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcHJvZ3Jlc3NEb3dubG9hZChkYXRhKSB7XHJcbiAgICBieXRlc1JlY2VpdmVkICs9IGRhdGEuYnl0ZUxlbmd0aDtcclxuICAgIGluY29taW5nRmlsZURhdGEucHVzaChkYXRhKTtcclxuICAgIGNvbnNvbGUubG9nKCdwcm9ncmVzczogJyArICgoYnl0ZXNSZWNlaXZlZCAvIGluY29taW5nRmlsZUluZm8uZmlsZVNpemUpICogMTAwKS50b0ZpeGVkKDIpICsgJyUnKVxyXG4gICAgaWYgKGJ5dGVzUmVjZWl2ZWQgPT09IGluY29taW5nRmlsZUluZm8uZmlsZVNpemUpIHtcclxuICAgICAgZW5kRG93bmxvYWQoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZW5kRG93bmxvYWQoKSB7XHJcbiAgICBpblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKGluY29taW5nRmlsZURhdGEsIHtcclxuICAgICAgdHlwZTogaW5jb21pbmdGaWxlSW5mby50eXBlXHJcbiAgICB9KTtcclxuXHJcbiAgICBkb3dubG9hZChibG9iLCBpbmNvbWluZ0ZpbGVJbmZvLmZpbGVOYW1lLCBpbmNvbWluZ0ZpbGVJbmZvLmZpbGVUeXBlKVxyXG4gIH1cclxuXHJcbiAgcGVlci5vbignZXJyb3InLCAoZXJyKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlcnIpXHJcbiAgfSk7XHJcblxyXG4gIGlucC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICBmaWxlID0gaW5wLmZpbGVzWzBdO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdzZW5kIGZpbGUnKTtcclxuICAgIGN1cnJlbnRDaHVuayA9IDA7XHJcbiAgICBwZWVyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICBmaWxlTmFtZTogZmlsZS5uYW1lLFxyXG4gICAgICBmaWxlU2l6ZTogZmlsZS5zaXplLFxyXG4gICAgICBmaWxlVHlwZTogZmlsZS50eXBlXHJcbiAgICB9KSk7XHJcbiAgICByZWFkTmV4dENodW5rKCk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gcmVhZE5leHRDaHVuaygpIHtcclxuICAgIHZhciBzdGFydCA9IEJZVEVTX1BFUl9DSFVOSyAqIGN1cnJlbnRDaHVuaztcclxuICAgIHZhciBlbmQgPSBNYXRoLm1pbihmaWxlLnNpemUsIHN0YXJ0ICsgQllURVNfUEVSX0NIVU5LKTtcclxuICAgIGZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoZmlsZS5zbGljZShzdGFydCwgZW5kKSk7XHJcbiAgfVxyXG5cclxuICBmaWxlUmVhZGVyLm9ubG9hZCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHBlZXIuc2VuZChmaWxlUmVhZGVyLnJlc3VsdCk7XHJcbiAgICBjdXJyZW50Q2h1bmsrKztcclxuXHJcbiAgICBpZiAoQllURVNfUEVSX0NIVU5LICogY3VycmVudENodW5rIDwgZmlsZS5zaXplKXtcclxuICAgICAgYXdhaXQgc2xlZXAoMjAwKTtcclxuICAgICAgcmVhZE5leHRDaHVuaygpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuY29uc3Qgc2xlZXAgPSAobWlsbGlzZWNvbmRzKSA9PiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtaWxsaXNlY29uZHMpKVxyXG59O1xyXG4iXX0=
