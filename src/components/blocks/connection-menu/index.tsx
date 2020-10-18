import React, { useContext } from 'react';
import { useStyles } from './styles';
import Paper from '../../elements/paper';
import Button from '../../elements/button';
import { AddCircle, AddIcCall, ExitToApp } from '@material-ui/icons';
import { socketService } from '../../../services';
import { speechService } from '../../../services/speech-recognition';
import { ConnectionContext, UserMediaContext } from '../../../contexts/connections';


type Props = {
  roomId: string;
  nickName: string;
  className?: string;
  exitAction: () => void;
}

const ConnectionMenu: React.FC<Props> = props => {
  const { roomId, nickName, className, exitAction } = props;
  const { stream } = useContext(UserMediaContext);
  const { isConnected } = useContext(ConnectionContext);
  const classes = useStyles();

  const createRoom = () => {
    socketService.connect(stream as MediaStream, nickName);
    speechService.start();
  }

  const exitRoom = () => {
    socketService.disconnect();
    speechService.stop();
    exitAction();
  }

  const connectRoom = () => {
    if (!isConnected) {
      socketService.connect(stream as MediaStream, nickName, roomId);
      speechService.start();
    }
  }

  return (
    <Paper className={`${classes.root} ${className}`}>
      {(!isConnected && roomId) && <Button className={`${classes.createRoom}`} text={'ルームに入室'} startIcon={<AddIcCall />} onClick={connectRoom} />}
      {!isConnected && <Button className={`${classes.createRoom}`} text={'新規ルーム作成'} startIcon={<AddCircle />} onClick={createRoom} />}
      {isConnected && <Button className={`${classes.exitRoom}`} text={'ルームから退室'} startIcon={<ExitToApp />} onClick={exitRoom} />}
    </Paper>
  );
}

export default ConnectionMenu;
