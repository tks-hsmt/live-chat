import React from 'react';
import MButton from '@material-ui/core/Button';
import { useStyles } from './styles';

type Props = {
  text: string;
  className?: string;
  color?: 'inherit' | 'default' | 'primary' | 'secondary' | undefined;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button: React.FC<Props> = props => {
  const { text, className, color, variant, startIcon, endIcon, onClick } = props;
  const classes = useStyles();
  return (
    <MButton
      className={`${classes.root} ${className}`}
      startIcon={startIcon && startIcon}
      endIcon={endIcon && endIcon}
      color={color}
      variant={variant}
      onClick={onClick} >
      {text}
    </MButton>
  );
}

export default Button;
