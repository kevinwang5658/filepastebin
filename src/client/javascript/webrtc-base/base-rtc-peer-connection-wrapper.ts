import { Socket } from 'socket.io-client';
import { Message, MessageAction, MessageType } from './models/message';

export abstract class BaseRtcPeerConnectionWrapper {

  abstract initDataChannel(): Promise<RTCDataChannel>;

  constructor(protected peer: RTCPeerConnection, protected id: string, protected socket: Socket) {
    this.peer.onconnectionstatechange = this.onconnectionstatechange;
    this.peer.onicecandidate = this.onicecandidate;
    this.peer.onicecandidateerror = this.onicecandidateerror;
  }

  public handleMessage = (message: Message) => {
    if (message.type !== MessageType.Signal) {
      return;
    }

    console.log('Got: ' + JSON.stringify(message));

    switch (message.action) {
      case MessageAction.IceCandidate:
        this.peer
          .addIceCandidate(new RTCIceCandidate(message.content))
          .catch((err: Event) => console.error(err));

        break;
      case MessageAction.Offer:
        if (message.content !== null) {
          this.peer
            .setRemoteDescription(message.content)
            .then(() => {
              this.createAnswer();
              console.log('Created Answer');
            }).catch((err: Event) => console.error(err));

        }
        break;
      case MessageAction.Answer:
        if (message.content !== null) {
          this.peer
            .setRemoteDescription(message.content)
            .then(() => {
              console.log('Answer set');
            }).catch((err: Event) => console.error(err));
        }
        break;
    }
  };

  //*****************************
  // Socket Messages
  //*****************************

  protected createOffer = () => this.peer.createOffer()
    .then((desc) => {
      console.log('createOffer');
      return this.peer.setLocalDescription(desc);
    }).then((desc) => {
      this.sendOffer(this.peer.localDescription.toJSON());
    }).catch((err) => console.error(err));

  protected createAnswer = () => this.peer.createAnswer()
    .then((desc) => {
      console.log('createAnswer');
      return this.peer.setLocalDescription(desc);
    }).then((desc) => {
      this.sendAnswer(this.peer.localDescription.toJSON());
    }).catch((err) => console.error(err));

  protected sendOffer = (content: string) => this.socket.send(new Message(this.id, MessageType.Signal, MessageAction.Offer, content));

  protected sendAnswer = (content: string) => this.socket.send(new Message(this.id, MessageType.Signal, MessageAction.Answer, content));

  protected sendIceCandidate = (content: RTCIceCandidate) => this.socket.send(new Message(this.id, MessageType.Signal, MessageAction.IceCandidate, content));

  //***************************
  // RTC lifecycle
  //***************************

  private onicecandidateerror = (err: RTCPeerConnectionIceErrorEvent) => console.log('Ice candidate error: ' + JSON.stringify(err));

  private onicecandidate = (event: RTCPeerConnectionIceEvent) => {
    this.sendIceCandidate(event.candidate);

    console.log('Ice Candidate: ' + JSON.stringify(event));
  };

  private onconnectionstatechange = () => console.log('Conenction state changed to: ' + this.peer.connectionState);

}
