import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useStyles } from './styles';

type Props = {
  className?: string;
  muted?: HTMLVideoElement['muted'];
  width?: HTMLVideoElement['width'];
  height?: HTMLVideoElement['height'];
  srcObject?: MediaStream | MediaSource | Blob | null;
}

const Video: React.FC<Props> = props => {
  const { srcObject, className, children, ...rest } = props;
  const videoRef = React.createRef<HTMLVideoElement>();
  const [video, setVideo] = useState<HTMLVideoElement>();
  const classes = useStyles();

  useEffect(() => {
    if (srcObject && videoRef && !video) {
      const current = videoRef?.current as HTMLVideoElement;
      current.srcObject = srcObject;
      current.play();
      setVideo(current);
    }
  }, [srcObject, videoRef, video]);

  return (
    <Box className={`${classes.root} ${className}`}>
      <video ref={videoRef} {...rest}></video>
    </Box>
  );
}

export default Video;
