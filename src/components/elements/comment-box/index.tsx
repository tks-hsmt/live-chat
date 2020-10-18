import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './styles';
import Paper from '../paper';

type Props = {
  name: string;
  time: string;
  text: string;
  className?: string;
}

const CommentBox: React.FC<Props> = props => {
  const { name, time, text, className } = props;
  const classes = useStyles();

  return (
    <Paper className={`${classes.root} ${className}`}>
      <Box className={classes.header}>
        <Typography className={classes.name}>{name}</Typography>
        <Typography className={classes.time}>{time}</Typography>
      </Box>
      <Typography className={classes.body}>{text}</Typography>
    </Paper>
  );
}

export default CommentBox;
