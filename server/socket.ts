import { Server } from 'http';
import { v4 } from 'uuid';
import socketIO from 'socket.io';
import redisAdapter from 'socket.io-redis';
import * as types from '../src/constants/connection-type';
import { SocketData } from '../src/models';

// ソケット種別を定義
type SocketType = typeof types[keyof typeof types];

export const connectSocket = (server: Server): void => {

  // 環境変数取得
  const { NODE_ENV, REDIS_URL } = process.env;

  // ソケットIO取得
  const io = socketIO();

  if (NODE_ENV === 'production') {
    if (!REDIS_URL) {
      throw new Error('REDIS_URL is not defined.')
    }
    try {
      io.adapter(redisAdapter(REDIS_URL))
    } catch (e) {
      throw new Error(e)
    }
  }

  // アタッチ
  io.attach(server, { transports: ['websocket'] });

  io.on('connection', (socket: socketIO.Socket & SocketData) => {
    console.log('====> [connect]', socket.id);

    let id: string | null = null;

    const createRoom = (roomId: string): string => {
      socket.join(roomId);
      io.to(socket.id).emit(types.JOIN, roomId);

      console.log(`====> [${types.JOIN}]:`, {
        roomId,
        rooms: Object.keys(io.sockets.adapter.rooms),
      });
      return roomId;
    }

    /**
     * JOIN
     */
    socket.on(types.JOIN, data => {
      id = createRoom(data.roomId ?? v4());
    });

    /**
     * CALL
     */
    socket.on(types.CALL, ({ roomId }) => {
      const rooms = Object.keys(io.sockets.adapter.rooms);
      console.log(`====> [${types.CALL}]`, {
        roomId,
        rooms,
      })

      if (!rooms.includes(roomId)) {
        id = createRoom(roomId);
        return;
      }

      const data = {
        roomId,
        fromId: socket.id,
      }

      id = roomId
      socket.join(roomId)
      socket.broadcast.to(roomId).emit(types.CALL, data)
    });

    /**
     * EXIT
     */
    socket.on(types.EXIT, ({ roomId }) => {
      console.log(`====> [${types.EXIT}]:`, {
        roomId,
        clientId: socket.id,
      });
      const data = {
        fromId: socket.id,
      };

      socket.broadcast.to(roomId).emit(types.EXIT, data);
    });

    /**
     * LEAVE
     */
    socket.on(types.LEAVE, ({ roomId }) => {
      console.log(`====> [${types.LEAVE}]:`, {
        roomId,
        clientId: socket.id,
      });

      socket.leave(roomId);
    });

    /**
     * DISCONNECT
     */
    socket.on('disconnect', () => {
      console.log(`====> [disconnect]`, {
        roomId: id,
        clientId: socket.id,
      });

      if (id) {
        socket.broadcast.to(id).emit(types.EXIT, { fromId: socket.id });
      }
    });

    /**
     * SPEECH
     */
    socket.on(types.SPEECH, ({ roomId, name, message }) => {
      console.log(`====> [speech]`, {
        roomId: id,
        clientId: socket.id,
        message: message
      });
      const data = {
        roomId,
        name,
        fromId: socket.id,
        message: message
      };
      socket.broadcast.to(roomId).emit(types.CALL, data);
    });

    /**
     * OTHER
     */
    ([types.OFFER, types.ANSWER, types.CANDIDATE] as Array<SocketType>).forEach(type => {
      socket.on(type, ({ toId, roomId, sdp }) => {
        const data = {
          fromId: socket.id,
          sdp,
        }

        console.log(`====> [${type}]:`, {
          roomId,
          sendTo: toId || 'everyone',
          fromId: socket.id,
        })

        if (toId) {
          socket.to(toId).emit(type, data)
        } else {
          socket.broadcast.to(roomId).emit(type, data)
        }
      })
    })
  })
}

