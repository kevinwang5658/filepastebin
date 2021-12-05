import { Constants } from "../../shared/constants";
import File = Constants.FileDescription;

export interface RoomState {
  roomId: string
  roomCode: string
  hostId: string,
  files: File[]
  ipAddress?: string,
}
