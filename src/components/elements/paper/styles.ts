import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    padding: theme.spacing(1),
    display: 'flex',
    overflow: 'auto',
    justifyContent: 'center',
    maxHeight: '100%'
  }
}));
