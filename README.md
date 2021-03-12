# FilePastebin
![Frame 1](https://user-images.githubusercontent.com/20214115/110989299-af2be580-833f-11eb-940c-4c0fed876c06.png)

[![Codeship Status for kevinwang5658/transferfirst](https://app.codeship.com/projects/ad2f6ec0-19d6-0137-b96c-1a1a0859fc7b/status?branch=master)](https://app.codeship.com/projects/328506)

FilePastebin ([link](https://www.filepastebin.com)) is a peer to peer file transfer website based on WebRTC. The goal of the website is to help users share files between their mobile phones and their computers for those of us who are unable to use airdrop. 

## How it works

The website uses a [Node.js](https://github.com/nodejs/node) backend with a [Preact](https://github.com/preactjs/preact) + vanilla HTML frontend. [SocketIO](https://github.com/socketio/socket.io) is used as a message carrier to transport messages between the sending and receiving clients as part of the WebRTC protocol. The process was designed using the [WebRTC guidelines from Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

