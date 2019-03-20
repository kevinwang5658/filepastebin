import {Socket} from "socket.io";
import {Constants} from "../../shared/constants";
import DATA = Constants.DATA;

export class Base {
    constructor(protected socket: Socket) {
        socket.on(Constants.MESSAGE, this.onmessage);
    }

    public onmessage = (payload: any) => {
        Object.keys(this.socket.rooms).forEach((room) => {
            if (room !== this.socket.id) this.socket.to(room).send(payload)
        })
    };
}