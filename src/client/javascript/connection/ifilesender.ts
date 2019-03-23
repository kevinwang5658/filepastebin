export interface IFileSender {
    sendFiles(progress?: number): void
    onprogresschanged(progress: number): void
}