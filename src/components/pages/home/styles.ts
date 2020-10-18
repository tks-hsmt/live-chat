import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  videoArea: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
  },
  speechArea: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 5,
    justifyContent: 'start !important',
    width: 300,
  },
  header: {
    display: 'flex',
    marginBottom: 5,
  },
  roomInput: {
    flexGrow: 1,
    marginRight: 5,
  },
  nickName: {
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    height: '100% !important',
  },
  connectionMenu: {
  },
  commentBox: {
    '&:not(:last-child)': {
      marginBottom: '.5rem'
    }
  }
}));
