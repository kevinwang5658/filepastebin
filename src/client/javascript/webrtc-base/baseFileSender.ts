export interface BaseFileSender {
    sendFiles(progress?: number): void
    onprogresschanged(progress: number): void
}
