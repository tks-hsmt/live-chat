import React from 'react';
import MPaper from '@material-ui/core/Paper';
import { useStyles } from './styles';

type Props = {
  className?: string;
}

const Paper: React.FC<Props> = props => {
  const { children, className } = props;
  // スタイルの取得
  const classes = useStyles();

  return (
    <MPaper className={`${classes.root} ${className}`}>
      {children}
    </MPaper>
  )
}

export default Paper;
