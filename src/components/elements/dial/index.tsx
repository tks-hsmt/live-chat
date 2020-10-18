import React, { useState } from 'react';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { useStyles } from './styles';

type Props = {
  className?: string;
  actions: {
    name: string;
    icon: JSX.Element;
    hidden?: boolean;
    handleClick?: () => void;
  }[];
}

const Dial: React.FC<Props> = props => {
  const { className, actions } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <SpeedDial
      ariaLabel='SpeedDial'
      className={`${classes.root} ${className}`}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction='up'
      color='secondary'
    >
      {actions.filter(({ hidden }) => !hidden).map(({ name, icon, handleClick }) => (
        <SpeedDialAction key={name} icon={icon} tooltipTitle={name} onClick={handleClick}></SpeedDialAction>)
      )}
    </SpeedDial>
  )
}

export default Dial;
