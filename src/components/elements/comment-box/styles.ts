import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible !important',
    maxHeight: '100%',
    boxSizing: 'content-box',
  },
  header: {
    display: 'flex',
  },
  name: {
    marginRight: 5,
    fontWeight: 'bold',
    fontSize: 14,
  },
  time: {
    fontSize: 14,
  },
  body: {
    fontSize: 14,
    wordBreak: 'break-word'
  }
}));
