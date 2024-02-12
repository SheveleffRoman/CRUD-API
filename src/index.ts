import dotenv from 'dotenv';
import createAPIServer from './server/server';

dotenv.config();

const server = createAPIServer();

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
