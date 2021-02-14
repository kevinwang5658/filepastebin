import {Constants} from "../../shared/constants";
import File = Constants.FileDescription;

export interface HostModel {
    roomId: string
    hostId: string,
    files: File[]
}
