export type ClientId = string;

export type RoomId = string;

export interface Stream {
  clientId: ClientId;
  stream: MediaStream;
}

export interface Speech {
  clientId: ClientId;
  name: string;
  message: string;
  time: string;
}

export interface Connection {
  roomId?: RoomId;
  name: string;
  isConnected: boolean;
  streams: Array<Stream>;
  speeches: Array<Speech>;
}

export interface PeerConnection {
  id: ClientId;
  pc: RTCPeerConnection;
}

export interface SocketEvent {
  roomId?: string;
  fromId: ClientId;
  sdp: RTCSessionDescription;
  name?: string;
  message?: string;
}
