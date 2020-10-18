import express from 'express';
import { createServer } from 'http';
import { connectSocket } from './socket';

const app = express();

const port = process.env.PORT || 8080;

const server = createServer(app);

server.listen(port, () => {
  console.log('> Ready on http://localhost:8080/');
});

connectSocket(server);
