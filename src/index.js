import WebSocket from 'ws';
import Config from './config';
import HashTable from 'simple-hashtable';
import RandomString from 'randomstring';
import MessageUtils from './utils/MessageUtils';
import Pong from './messages/Pong';

let server = null;
let clients = new HashTable();


let startServer = () => {
  let port = Config.port;
  let path = '/slither';

  console.log('[SERVER] Starting Server...');
  server = new WebSocket.Server({port: port, path: path}, () => {
    console.log('[SERVER] Server Started at 127.0.0.1:' + port + '! Waiting for Connections...');
  });
};

let bindConnection = () => {
  if (server.readyState === server.OPEN) {
    server.on('connection', onConnect.bind(server));
  } else {
    console.log(server.readyState);
  }
};

let onConnect = (connection) => {
  if (clients.size() >= Config.maxConnections) {
    console.log('[SERVER] Connection limit exceeded. closing incoming connection');
    connection.close();
    return;
  }

  connection.id = RandomString.generate(10);
  clients.put(connection.id, connection);
  console.log('connected client', connection.id, 'total', clients.size());

  connection.on('message', onReceiveMessage.bind(this, connection));
  connection.on('error', closeServer);
  connection.on('close', () => {
    console.log('[DEBUG] connection with', connection.id, 'is closed.');
    // messages.end.build(2);
    if (connection.snake && connection.snake.update) {
      clearInterval(connection.snake.update);
    }
    clients.remove(connection.id);
  });
};

let onReceiveMessage = (connection, data) => {
  console.log('message from', connection.id);
  if (data.length === 0) {
    console.log('[SERVER] No Data to handle!');
    return;
  }
  if (data.length >= 227) {
    console.log('[SERVER] Data length exceded limit');
    connection.close();
  } else if (data.length === 1) {
    let value = MessageUtils.readInt8(0, data);
    if (value <= 250) {
      if (value === connection.snake.direction.angle) {
        console.log('[DEBUG] Angle is equal to last');
        return;
      }
      let radians = value * 2*Math.PI / 251;
      let speed = 1;
      let x = Math.cos(radians) + 1;
      let y = Math.sin(radians) + 1;
      connection.snake.direction.x = x * 127 * speed;
      connection.snake.direction.y = y * 127 * speed;
      connection.snake.direction.angle = radians;
    } else if (value === 253) {
      console.log('Snake in normal mode');
    } else if (value === 254) {
      console.log('Snake in speed mode');
    } else if (value === 251) {
      sendMessage(connection.id, Pong.build());
    }
  }
};

let sendMessage = (id, message) => {
  console.log(id, message);
};

let closeServer = () => {
  console.log('[SERVER] closing server');
  server.close();
};

startServer();
bindConnection();
