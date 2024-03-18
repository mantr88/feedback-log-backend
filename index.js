import express from 'express';
import dotenv from 'dotenv/config.js';
import http from 'http';
import { Server } from 'socket.io';
import { db } from './db.js';
import commentsController from './controllers/comments.js';
import authController from './controllers/auth.js';

const app = express();
app.use(express.json());

const server = http.Server(app);
const port = process.env.PORT || 8000;

const io = new Server(server, {
  cookie: true,
  cors: {
    origin: '*',
    credentials: true,
  },
});

server.listen(port, () => {
  console.log('listening on *:' + port);
});

db.connect(error => {
  if (error) {
    console.log(error);
  }
});

io.on('connection', socket => {
  //getComments
  commentsController.getComments(socket);
  //addComment
  socket.on('add_comment', async data => {
    commentsController.addComment(data, socket);
  });
  //registration
  socket.on('register', data => {
    authController.register(data, socket);
  });

  //login
  socket.on('login', data => {
    authController.login(data, socket);
  });

  //logout
  socket.on('logout', data => {
    authController.logout(socket);
  });
});
