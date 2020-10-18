import React, { useEffect, useState } from 'react';
import { useStyles } from './styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CopyToClipBoard from 'react-copy-to-clipboard';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Tooltip from '@material-ui/core/Tooltip';

type Props = {
  label?: string;
  text?: string;
  className?: string;
  isCopyButton?: boolean;
  isDisable?: boolean;
  handleValueChange?: (text: string) => void;
}

const Input: React.FC<Props> = props => {
  const { label, text, className, isCopyButton, isDisable, handleValueChange } = props;
  const [value, setValue] = useState<string>('');
  const [openTip, setOpenTip] = useState<boolean>(false);
  const classes = useStyles();

  useEffect(() => {
    setValue(text || '');
  }, [text]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (handleValueChange) {
      handleValueChange(event.target.value);
    }
  }

  return (
    <Grid className={`${classes.root} ${className}`}>
      <FormControl className={classes.text} size='small'>
        <InputLabel variant='outlined'>{label}</InputLabel>
        <OutlinedInput className={classes.text} value={value} disabled={isDisable} onChange={handleChange} endAdornment={isCopyButton &&
          <InputAdornment position="end">
            <Tooltip
              arrow
              open={openTip}
              onClose={() => setOpenTip(false)}
              disableHoverListener
              placement='top'
              title='Copied!'>
              <CopyToClipBoard text={value}>
                <IconButton disabled={!value} onClick={() => setOpenTip(true)} edge="end" ><AssignmentIcon /></IconButton>
              </CopyToClipBoard>
            </Tooltip>
          </InputAdornment>
        }
        />
      </FormControl>
    </Grid>
  );
}

export default Input;
