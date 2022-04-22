export namespace Constants {
  //***********************
  // SocketIO lifecycle
  //***********************

  export const CONNECT = 'connect';
  export const DISCONNECT = 'disconnect';
  export const ERROR = 'error';
  export const MESSAGE = 'message';

  //**********************
  // Files
  //**********************
  export interface FileDescription {
    fileName: string;
    fileSize: number;
    fileType: string;
  }

  //********************
  // RTC host requests
  //*********************

  export const REQUEST_HOST = 'request-host';

  export interface RequestHostRequestModel {
    files: FileDescription[];
  }

  export interface RequestHostAcceptedModel {
    roomCode: string;
    files: FileDescription[];
  }

  //**********************
  // RTC client requests
  //**********************

  export const REQUEST_JOIN_ROOM = '/request/room/';

  export const REQUEST_CLIENT = 'request-client';
  export const NEW_CLIENT_JOINED = 'new-client-joined';

  export interface RequestClientAcceptedModel {
    roomId: string;
    files: FileDescription[];
  }

  //************************
  // RTC Constants
  //*********************

  export const SOCKET_IO_BYTES_PER_CHUNK = 1000000;
  export const MAX_BUFFER = 100 * 1024;

  export const RTC_OPEN = 'open';
  export const RTC_INIT_TIMEOUT = 5000;

  export const PeerConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  //***********************
  // Socket Constants
  //************************

  export const DATA = 'data';

  //***********************
  // Channel Constants
  //************************

  // client =====> host
  export const READY = 'ready';
  // bytes are sent
  // host =====> client
  export const EOF = 'eof';
}
