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
    Signal = 'signal'
}

export enum MessageAction {
    Offer = 'offer',
    Answer = 'answer',
    CreatePeer = 'create-peer'
}

export class FileChunkRequest {
    constructor(
       public fileName: string,
       public chunkStart: number,
       public chunkEnd: number
    ) {}
}