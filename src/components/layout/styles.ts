import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { grey, deepPurple, teal } from '@material-ui/core/colors';

export const userTheme = (darkState: boolean) => createMuiTheme({
  palette: {
    type: darkState ? 'dark' : 'light',
    primary: {
      main: darkState ? grey[900] : teal[500]
    },
    secondary: {
      main: darkState ? teal[500] : deepPurple[500]
    }
  }
});

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'hidden'
  },
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(2),
    height: '100%',
    overflow: 'hidden'
  }
}));
