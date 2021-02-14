import {Message} from "./models/message";

export interface BaseFileSender {
    sendFiles(progress?: number): void
    onProgressChanged(progress: number): void
}
