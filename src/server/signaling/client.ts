import { Socket } from 'socket.io';
import { Base } from './base';
import { Constants } from '../constants';
import { HostModel } from '../storage/host-model';
import REQUEST_CLIENT_ACCEPTED = Constants.REQUEST_CLIENT_ACCEPTED;
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;

export class Client extends Base {

  private host: HostModel;

  constructor(
    socket: Socket,
    private io: SocketIO.Server,
    private hostMap: Map<string, HostModel>,
    private roomId: string) {
    super(socket);
  }

  public createClient(): void {
    if (!this.hostMap.get(this.roomId)) {
      this.socket.emit('exception', 'host disconnected');
      return;
    }

    this.host = this.hostMap.get(this.roomId);

    this.socket.join(this.roomId);
    this.socket.emit(REQUEST_CLIENT_ACCEPTED, <RequestClientAcceptedModel>{
      roomId: this.roomId,
      files: this.host.files,
    });

    console.info(`Client connected: ${this.roomId}`);
  }

}
