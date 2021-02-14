import {request} from "http";
import {Constants} from "../../../shared/constants";
import REQUEST_JOIN_ROOM = Constants.REQUEST_JOIN_ROOM;

export function requestJoinRoom(roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200){
                resolve(this.response === "true")
            }
        };
        xhttp.onerror = () => reject();

        xhttp.open("GET", REQUEST_JOIN_ROOM + roomId, true);
        xhttp.send();
    })
}
