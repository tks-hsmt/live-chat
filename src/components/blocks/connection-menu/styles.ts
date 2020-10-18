import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: theme.palette.primary.main,
    width: '80%',
    bottom: 10
  },
  button: {
  }
}));
