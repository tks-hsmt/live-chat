import { DateTime } from 'luxon';
import React, { createContext, useMemo, useEffect, useState } from 'react';
import { Connection, RoomId, Speech } from '../../models/connection';
import { socketService, userMediaService } from '../../services';
import { speechService } from '../../services/speech-recognition';

export const ConnectionContext = createContext<Connection>({
  name: '',
  isConnected: false,
  streams: [],
  speeches: [],
});

export const UserMediaContext = createContext<{ stream?: MediaStream }>({
  stream: undefined
});

const ConnectionProvider: React.FC = props => {
  const { children } = props;

  const [value, setValue] = useState<Connection>({
    name: '',
    isConnected: false,
    streams: [],
    speeches: [],
  });

  const [stream, setStream] = useState<{ stream?: MediaStream }>({
    stream: undefined
  });

  useEffect(() => {
    socketService.init(setValue);
    speechService.init((message: string) => {
      setValue(state => ({
        ...state, speeches: [
          ...state.speeches as Array<Speech>, { name: state.name, message, time: DateTime.local().toFormat('HH:mm') } as Speech]
      }));
      socketService.sendSpeech(value.roomId as RoomId, value.name, message);
    }, () => {
      setValue(state => ({ ...state, speeches: [] }));
    });
  }, [value.roomId, value.name]);

  useMemo(async () => {
    const stream = await userMediaService.getStream({ video: true, audio: { echoCancellation: true, noiseSuppression: false } });
    setStream({ stream: stream as MediaStream });
  }, []);

  return (
    <UserMediaContext.Provider value={stream}>
      <ConnectionContext.Provider value={value}>
        {children}
      </ConnectionContext.Provider>
    </UserMediaContext.Provider>
  )
};

export default ConnectionProvider;
