import React, { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { v4 } from 'uuid';
import { useStyles } from './styles';
import Paper from '../../elements/paper';
import Video from '../../elements/video';
import Input from '../../elements/form/input';
import { ConnectionContext, UserMediaContext } from '../../../contexts/connections';
import CommentBox from '../../elements/comment-box';
import ConnectionMenu from '../../blocks/connection-menu';

const Home: React.FC = () => {
  const { roomId, streams, speeches, isConnected } = useContext(ConnectionContext);
  const { stream } = useContext(UserMediaContext);
  const [videoWidth, setVideoWidth] = useState(620);
  const [inputRoomId, setInputRoomId] = useState('');
  const [nickName, setNickName] = useState('名無し');
  const classes = useStyles();

  useEffect(() => {
    if (streams.length !== 0) {
      const width = document.getElementsByClassName(classes.paper)?.item(0)?.clientWidth || 1280;
      console.log(width);
      setVideoWidth((width / 2) - 40);
    }
  }, [streams.length, classes.paper]);

  return (
    <Box className={classes.root}>
      <Box className={classes.videoArea}>
        <Box className={classes.header}>
          <Input className={classes.roomInput}
            label='ルームID'
            text={roomId || ''}
            isCopyButton={true}
            isDisable={isConnected}
            handleValueChange={(text: string) => setInputRoomId(text)} />
          <Input className={classes.nickName}
            label='ニックネーム'
            text={nickName}
            isDisable={isConnected}
            handleValueChange={(text: string) => setNickName(text)} />
        </Box>
        <Paper className={classes.paper}>
          <Video srcObject={stream} width={videoWidth} muted></ Video>
          {isConnected && streams?.map(stream => <Video key={stream.clientId} srcObject={stream.stream} width={videoWidth}></ Video>)}
        </Paper>
        <ConnectionMenu className={classes.connectionMenu} roomId={inputRoomId} nickName={nickName} exitAction={() => setInputRoomId('')} />
      </Box>
      {isConnected &&
        <Paper className={classes.speechArea}>
          {speeches.length === 0 && <>{'話した内容が表示されます'}</>}
          {speeches?.map(({ clientId, name, message, time }) =>
            <CommentBox
              className={classes.commentBox}
              key={v4()}
              name={name}
              time={time}
              text={message} />)}
        </Paper>}
    </Box>
  )
}

export default Home;
