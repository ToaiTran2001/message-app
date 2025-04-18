export interface SendRequest {
  friendId: string;
}

export interface SendResponse {
  friendId: string;
  responseStatus: string;
}

export interface MessageResponse {
  message: string;
}