import { AppProps } from 'next/dist/next-server/lib/router/router';
import React from 'react';
import Layout from '../components/layout';
import ConnectionProvider from '../contexts/connections';
import '../../styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ConnectionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConnectionProvider>
  )
}

export default App;
