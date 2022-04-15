import { Constants } from '../constants';
import File = Constants.FileDescription;

export interface HostModel {
  roomId: string;
  roomCode: string;
  hostId: string;
  files: File[];
  ipAddress?: string;
}
