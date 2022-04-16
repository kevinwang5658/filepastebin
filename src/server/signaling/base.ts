import { Socket } from 'socket.io';
import { Constants } from '../constants';

export class Base {
  constructor(protected socket: Socket) {
    socket.on(Constants.MESSAGE, this.onmessage);
  }

  public onmessage = (payload: any): void => {
    Object.keys(this.socket.rooms).forEach((room) => {
      if (room !== this.socket.id) this.socket.to(room).send(payload);
    });
  };
}
