import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import * as actions from './actions/index';
import {mapUrl} from 'utils/url.js';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import mongoose from 'mongoose';
import passport from 'passport';

const pretty = new PrettyError();
const app = express();

const server = new http.Server(app);
const MongoStore = require('connect-mongo')(session);

const io = new SocketIo(server);
io.path('/ws');

app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'this is my new random 23 1234 key 23',
  store: new MongoStore({ url: config.database.url }),
  cookie: {maxAge: 3600000000}, // one hour
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

//
  // MongoDB Connections ** CUSTOM **
  // -----------------------------------------------------------------------------

// Create the database connection
mongoose.connect(config.database.url);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  console.info('----\n==> 🍃  Mongoose default connection open to ' + config.database.url);
});
// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

  const {action, params} = mapUrl(actions, splittedUrlPath);

  if (action) {
    action(req, params)
      .then((result) => {
        if (result instanceof Function) {
          result(res);
        } else {
          res.json(result);
        }
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect);
        } else {
          console.error('API ERROR:', pretty.render(reason));
          res.status(reason.status || 500).json(reason);
        }
      });
  } else {
    res.status(404).end('NOT FOUND');
  }
});


const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });

  io.on('connection', (socket) => {
    socket.emit('news', {msg: `'Hello World!' from server`});

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('bid', (data) => {
      io.emit('newBid', data);
      console.log('getting bid data', data);
    });

    socket.on('msg', (data) => {
      data.id = messageIndex;
      messageBuffer[messageIndex % bufferSize] = data;
      messageIndex++;
      io.emit('msg', data);
    });
  });
  io.listen(runnable);
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
