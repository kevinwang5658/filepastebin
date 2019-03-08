
export namespace Constants {
    //***********************
    // SocketIO lifecycle
    //***********************

    export const CONNECT = 'connect';
    export const DISCONNECT = 'disconnect';
    export const ERROR = 'error';
    export const MESSAGE = 'message';

    //********************
    // RTC host requests
    //*********************

    export const REQUEST_HOST = 'request-host';

    export interface RequestHostRequestModel {
        fileName: String,
        fileSize: Number,
        fileType: String
    }

    export const REQUEST_HOST_ACCEPTED = 'request-host-accepted';

    //**********************
    // RTC client requests
    //**********************

    export const REQUEST_CLIENT = 'request-client';
    export const REQUEST_CLIENT_ACCEPTED = 'request-client-accepted';

}