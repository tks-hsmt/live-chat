import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Switch from '@material-ui/core/Switch';
import Container from '@material-ui/core/Container';
import { userTheme, useStyles } from './styles';

type Props = {
}

const Layout: React.FC<Props> = props => {
  const { children } = props;
  // ダークテーマの選択状態 TODO ユーザー設定によって変えて良いかも
  const [darkState, setDarkState] = useState(true);
  // テーマの取得
  const darkTheme = userTheme(darkState);
  // スタイルの取得
  const classes = useStyles();
  // ページタイトル
  const title = 'Chat Live';

  /**
   * テーマ変更
   */
  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <header>
          <link rel='icon' href='/favicon.ico' />
        </header>
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography>{title}</Typography>
            <Switch checked={darkState} onChange={handleThemeChange}></Switch>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <Container className={classes.container}>
            <>{children}</>
          </Container>
        </main>
        <footer>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default Layout;
