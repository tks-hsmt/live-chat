import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: theme.palette.primary.main,
    overflow: 'hidden'
  },
  createRoom: {
    color: `${theme.palette.secondary.main} !important`
  },
  exitRoom: {
    color: `${theme.palette.error.main} !important`
  }
}));
