import React from 'react';
import io from 'socket.io-client';
import { ClientId, RoomId, PeerConnection, SocketEvent, Stream, Connection, Speech } from '../../models/connection';
import * as types from '../../constants/connection-type';
import { DateTime } from 'luxon';

/**
 * ソケットサービス
 */
class SocketService {

  /** ソケット */
  private socket: null | SocketIOClient.Socket;
  /** ユーザーメディアストリーム */
  private stream: null | MediaStream;
  /** PCコネクション */
  private peerConnections: Array<PeerConnection>;

  /** 設定メソッド */
  private setValue: React.Dispatch<React.SetStateAction<Connection>> = () => { };

  constructor(private domain: string) {
    this.socket = null;
    this.stream = null;
    this.peerConnections = [];
  }

  /**
   * 初期処理
   * @param setValue 設定メソッド
   */
  init = (setValue: React.Dispatch<React.SetStateAction<Connection>>): void => {
    this.setValue = setValue;
  };

  /**
   * 通信開始
   * @param stream 自PCのメディアストリーム
   * @param name ユーザー名
   * @param roomId ルームID
   */
  connect = (stream: MediaStream, name: string, roomId?: RoomId): void => {
    this.stream = stream;
    this.socket = io(this.domain, { transports: ['websocket', 'polling'] });
    const type = !roomId ? types.JOIN : types.CALL;
    // connectイベント監視
    this.socket.on(types.CONNECT, () => {
      console.log(`[connect] ${roomId}`);
      this.setValue(state => ({ ...state, roomId: roomId, name: name, isConnected: true }));
      this.socket?.emit(type, { roomId });
    });
    // joinイベント監視
    this.socket.on(types.JOIN, (roomId: RoomId) => {
      console.log(`[join] ${roomId}`);
      this.setValue(state => ({ ...state, roomId: roomId, name: name, isConnected: true }));
    });
    // callイベント監視
    this.socket.on(types.CALL, async ({ roomId, fromId }: SocketEvent) => {
      if (this.getPeerConnection(fromId)) { return; }
      const pc = this.prepareConnection(roomId as RoomId, fromId);
      const sessionDescription = await pc.createOffer();
      await pc.setLocalDescription(sessionDescription);
      this.sendSDP(roomId as RoomId, fromId, sessionDescription);
    });
    // offerイベント監視
    this.socket.on(types.OFFER, async ({ roomId, fromId, sdp }: SocketEvent): Promise<void> => {
      const receivedOffer = new RTCSessionDescription(sdp);
      const pc = this.prepareConnection(roomId as string, fromId);
      if (!pc) { return; }
      try {
        await pc.setRemoteDescription(receivedOffer);
        const sessionDescription = await pc.createAnswer();
        await pc.setLocalDescription(sessionDescription);
        this.sendSDP(roomId as string, fromId, sessionDescription);
      } catch (e) {
        console.error(e);
      }
    });
    // answerイベント監視
    this.socket.on(types.ANSWER, async ({ fromId, sdp }: SocketEvent): Promise<void> => {
      const receivedAnswer = new RTCSessionDescription(sdp);
      const pc = this.getPeerConnection(fromId);
      if (!pc) {
        console.log('[receivedAnswer]: Cound not find RTCPeerConnection');
        return;
      }
      try {
        await pc.setRemoteDescription(receivedAnswer);
      } catch (e) {
        console.log(e);
      }
    });
    // candidateイベント監視
    this.socket.on(types.CANDIDATE, ({ fromId, sdp }: Record<string, any>) => {
      const candidate = new RTCIceCandidate(sdp.ice);
      const pc = this.getPeerConnection(fromId);
      if (!pc) { return; }
      pc.addIceCandidate(candidate).catch(() => {
        console.log('unresolved setRemoteDescription');
        pc.setRemoteDescription(sdp);
      });
    });
    // speechイベント監視
    this.socket.on(types.SPEECH, ({ fromId, name, message }: SocketEvent) => {
      this.setValue(state => ({
        ...state, speeches: [
          ...state.speeches as Array<Speech>,
          { clientId: fromId, name, message, time: DateTime.local().toFormat('HH:mm') } as Speech
        ]
      }));
    });
    // exitイベント監視
    this.socket.on(types.EXIT, ({ fromId }: SocketEvent) => this.disconnectPeerConnection(fromId));
  }

  /**
   * メッセージ送信
   * @param message メッセージ
   */
  sendSpeech = (roomId: RoomId, name: string, message: string) => {
    this.socket?.emit(types.SPEECH, { roomId, name, message });
  }

  /**
   * 通信終了
   */
  disconnect = (): void => {
    this.socket?.disconnect();
    this.setValue(state => ({ ...state, roomId: undefined, isConnected: false, streams: [] }));
  }

  /**
   * RTCPeerConnection取得
   * @param clientId クライアントID
   * @return RTCPeerConnection
   */
  private getPeerConnection = (clientId: ClientId) => this.peerConnections.find(({ id }) => id === clientId)?.pc;

  /**
   * RTCPeerConnection設定
   * @param clientId クライアントID
   * @param pc RTCPeerConnection
   */
  private setPeerConnection = (clientId: ClientId, pc: RTCPeerConnection) => {
    const index = this.peerConnections.findIndex(({ id }) => id === clientId);
    const peerConnection = { id: clientId, pc };
    this.peerConnections = (index < 0) ? [...this.peerConnections, peerConnection] : [
      ...this.peerConnections.slice(0, index),
      peerConnection,
      ...this.peerConnections.slice(index + 1),
    ];
  }

  /**
   * RTCPeerConnection準備
   * @param clientId クライアントID
   * @return RTCPeerConnection
   */
  private prepareConnection = (roomId: RoomId, clientId: ClientId): RTCPeerConnection => {
    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };
    const pc = new RTCPeerConnection(config);
    pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => this.handleIceCandidate(e, roomId, clientId);
    pc.ontrack = (e: RTCTrackEvent) => this.handleTrack(e, clientId);
    pc.oniceconnectionstatechange = () => this.handleIceConnectionStateChange(clientId);
    this.stream?.getTracks().forEach(track => {
      if (this.stream === null) { return; }
      pc.addTrack(track, this.stream);
      this.setPeerConnection(clientId, pc);
    });
    return pc;
  }

  /**
   * RTCPeerConnection切断
   * @param clientId クライアントID
   */
  private disconnectPeerConnection = async (clientId: ClientId): Promise<void> => {
    // PC取得
    const pc = this.getPeerConnection(clientId);
    // PCが存在しない場合は何もしない
    if (!pc) { return; }
    // クローズ処理
    pc.close();
    pc.oniceconnectionstatechange = null;
    pc.ontrack = null;
    pc.oniceconnectionstatechange = null;
    this.peerConnections = this.peerConnections.filter(({ id }) => id !== clientId);
    this.setValue(state => ({ ...state, streams: state.streams?.filter(stream => stream.clientId !== clientId) }));
  }

  /**
   * setLocalDescription実行時処理
   * @param event イベント
   * @param clientId クライアントID
   */
  private handleIceCandidate = (event: RTCPeerConnectionIceEvent, roomId: RoomId, clientId: ClientId): void => {
    // for Tricle ICE
    if (!!event.candidate) {
      const data = {
        toId: clientId,
        roomId: roomId,
        sdp: {
          type: types.CANDIDATE,
          ice: event.candidate,
        },
      }
      this.socket?.emit(types.CANDIDATE, data);
    }
  }

  /**
   * RemoteからのMediaStream受信時処理
   * @param event イベント
   * @param clientId クライアントID
   */
  private handleTrack = async (event: RTCTrackEvent, clientId: ClientId): Promise<void> => {
    const [stream] = event.streams;
    this.setValue(state => {
      if (state.streams?.find((stream) => stream.clientId === clientId)) { return { ...state } }
      return { ...state, streams: [...state.streams as Stream[], { clientId, stream } as Stream] };
    });
  }

  /**
   * ICEコネクション状態変更
   * @param clientId クライアントID
   */
  private handleIceConnectionStateChange = (clientId: ClientId): void => {
    const pc = this.getPeerConnection(clientId)
    if (!pc) { return; }
    switch (pc.iceConnectionState) {
      case 'disconnected':
        this.disconnectPeerConnection(clientId);
        return;
      default:
        return;
    }
  }

  /**
   * SDP送信
   * @param roomId ルームID
   * @param clientId クライアントID
   * @param sessionDescription セッション
   */
  private sendSDP = (roomId: RoomId, clientId: ClientId, sessionDescription: RTCSessionDescription | RTCSessionDescriptionInit) => {
    const data = {
      toId: clientId,
      roomId: roomId,
      sdp: sessionDescription,
    }
    this.socket?.emit(sessionDescription.type as string, data);
  }
}

export const socketService = new SocketService(process.env.DOMAIN || 'http://localhost:8080' as string);
