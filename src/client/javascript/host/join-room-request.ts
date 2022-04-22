import { Constants } from '../constants';
import REQUEST_JOIN_ROOM = Constants.REQUEST_JOIN_ROOM;

export async function fetchRoomIdFromCode(roomCode: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (this.response) {
          resolve(JSON.parse(this.response).roomId);
        } else {
          resolve(null);
        }
      }
    };
    xhttp.onerror = () => reject();

    xhttp.open('GET', REQUEST_JOIN_ROOM + roomCode, true);
    xhttp.send();
  });
}
