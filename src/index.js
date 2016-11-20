import Server from 'socket.io';

const port = 4000;

let startServer = () => {
  const io = new Server().attach(port);

  // listen to connections
  io.on('connection', socket => {
    console.log('a user connected');

    // disconnet message
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    // log when a message is arrived
    socket.on('message', msg => {
      console.log('A message was received:', msg);
    });
  });
};

startServer();
console.log('Server started at port ' + port);
