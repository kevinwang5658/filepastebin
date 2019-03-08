import {Socket} from "socket.io";
import {Constants} from "../../shared/constants";

export class SocketManager {

    constructor(private socket: Socket){
        socket.on(Constants.DISCONNECT, (reason) => console.log(reason));
        socket.on(Constants.ERROR, (err) => console.log(err));
        socket.on(Constants.REQUEST_HOST_ACCEPTED, this.onhost);
    }

    public requestHost = (file: File) => {
        this.socket.emit(Constants.REQUEST_HOST, <Constants.RequestHostRequestModel>{
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        })
    };

    public onhost = () => {};

    /*public onhostaccepted = (session) => {
        console.log('Created room: ' + session);
        share_url.innerText = window.location + session;
        code_element.innerText = session;
        file_name.innerText = file.name;

        center_initial.style.display = 'none';
        center_host.style.display = 'flex';
    });

socket.on('client_connected', (num) => {
    client_connected_number.innerText = num;
});

socket.on('disconnect', (reason) => console.log(`Disconnected from Socket: ${reason}`));

socket.on('error', (error) => console.log('error', error));

socket.on('exception', (error) => {
    alert(error);
});

socket.on('message', (message) => {
    switch (message.type) {
        case 'signal':
            handleSignalMessage(message);
            break;
    }
});*/
}