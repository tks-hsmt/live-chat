import React from 'react';
import Layout from './components/layout';
import Home from './components/pages/home';
import ConnectionProvider from './contexts/connections';

const App = () => {
  return (
    <ConnectionProvider>
      <Layout>
        <Home />
      </Layout>
    </ConnectionProvider>
  )
}

export default App;