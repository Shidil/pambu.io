'use strict';

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = 4000;

var startServer = function startServer() {
  var io = new _socket2.default().attach(port);

  // listen to connections
  io.on('connection', function (socket) {
    console.log('a user connected');

    // disconnet message
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    // log when a message is arrived
    socket.on('message', function (msg) {
      console.log('A message was received:', msg);
    });
  });
};

startServer();
console.log('Server started at port ' + port);