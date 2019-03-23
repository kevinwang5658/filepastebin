export declare class Message {
    senderId: string;
    type: MessageType;
    action: MessageAction;
    content: any;
    constructor(senderId: string, type: MessageType, action: MessageAction, content: any);
}
export declare enum MessageType {
    Request = "request",
    Signal = "signal",
    Data = "data"
}
export declare enum MessageAction {
    Offer = "offer",
    Answer = "answer",
    CreatePeer = "create-peer",
    IceCandidate = "ice-candidate"
}
export declare class FileChunkRequest {
    fileName: string;
    chunkStart: number;
    chunkEnd: number;
    constructor(fileName: string, chunkStart: number, chunkEnd: number);
}
