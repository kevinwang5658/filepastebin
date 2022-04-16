export interface Host {
  id: string;
  roomCode: string;
  files: File[];
  ipAddress?: string;
}

export interface File {
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface RequestHostRequestModel {
  files: File[];
}

export interface RequestHostAcceptedModel {
  roomCode: string;
  files: File[];
}

export interface RequestClientAcceptedModel {
  roomId: string;
  files: File[];
}
