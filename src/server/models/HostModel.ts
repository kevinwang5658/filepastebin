import {Constants} from "../../shared/constants";
import File = Constants.File;

export interface HostModel {
    roomId: string
    hostId: string,
    files: File[]
}
