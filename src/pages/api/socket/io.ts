import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/socket';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  // Check if we're using the custom server
  if (res.socket.server.io) {
    console.log('Socket.IO already set up');
    res.end();
    return;
  }

  // If not using custom server, use existing io instance from socket.server
  console.log('Using io instance from request server');
  res.end();
};

export default ioHandler;