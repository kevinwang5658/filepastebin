import {request} from "http";
import {Constants} from "../../../shared/constants";
import REQUEST_JOIN_ROOM = Constants.REQUEST_JOIN_ROOM;

export function requestJoinRoom(roomId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200){
                if (this.response) {
                    resolve(JSON.parse(this.response))
                } else {
                    resolve(null)
                }
            }
        };
        xhttp.onerror = () => reject();

        xhttp.open("GET", REQUEST_JOIN_ROOM + roomId, true);
        xhttp.send();
    })
}
