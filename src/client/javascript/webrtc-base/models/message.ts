export class Message {
    constructor(
        public senderId: string,
        public type: MessageType,
        public action: MessageAction,
        public content: any,
    ) {}
}

export enum MessageType {
    Request = 'request',
    Signal = 'signal',
    Data = 'data'
}

export enum MessageAction {
    Offer = 'offer',
    Answer = 'answer',
    CreatePeer = 'create-peer',
    IceCandidate = 'ice-candidate'
}

export class FileRequest {
    constructor(
       public fileName: string,
    ) {}
}
