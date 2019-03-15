
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
        fileName: string,
        fileSize: number,
        fileType: string
    }

    export const REQUEST_HOST_ACCEPTED = 'request-host-accepted';
    export interface RequestHostAcceptedModel {
        roomId: string,
        fileName: string,
        fileSize: number,
        fileType: string
    }

    //**********************
    // RTC client requests
    //**********************

    export const REQUEST_CLIENT = 'request-client';
    export const REQUEST_CLIENT_ACCEPTED = 'request-client-accepted';
    export interface RequestClientAcceptedModel {
        roomId: string,
        fileName: string,
        fileSize: number,
        fileType: string
    }

    //************************
    // RTC Constants
    //*********************

    export const BYTES_PER_CHUNK = 15000;
    export const MAX_BUFFER = 100 * 1024;

    export const NUMBER_WORKERS = 10;
    export const RTC_OPEN = 'open';

    //***********************
    // Channel Constants
    //************************

    // client =====> host
    export const READY = 'ready';
    // bytes are sent
    // host =====> client
    export const EOF = 'eof';

}