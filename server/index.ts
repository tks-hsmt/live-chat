import express, { Request, Response } from 'express';
import next from 'next';
import { createServer } from 'http';
import { connectSocket } from './socket';

const dev = process.env.NODE_ENV !== 'production';
const serverApp = next({ dev });
const handle = serverApp.getRequestHandler();
const port = process.env.PORT || 8080;

async function main() {
  try {
    const app = express();
    const server = createServer(app);
    await serverApp.prepare();
    app.get('*', (req: Request, res: Response) => {
      return handle(req, res);
    });
    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on ${process.env.DOMAIN}:${port}/`);
    });
    connectSocket(server);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
