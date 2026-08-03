export class Message {
  constructor(
    public senderId: string,
    public type: MessageType,
    public action: MessageAction,
    public content: unknown,
  ) {}
}

export enum MessageType {
  Signal = 'signal',
}

export enum MessageAction {
  Offer = 'offer',
  Answer = 'answer',
  IceCandidate = 'ice-candidate',
}
