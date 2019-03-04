export namespace SocketIO {
    export const REQUEST_HOST = 'request-host';
    export interface RequestHostRequestModel {
        fileName: String,
        fileSize: String,
        fileType: String
    }

    export const REQUEST_HOST_ACCEPTED = 'request-host-accepted';

}