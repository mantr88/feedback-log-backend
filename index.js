import express from 'express';
import dotenv from 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { db } from './db.js';
import commentsController from './controllers/comments.js';
import authController from './controllers/auth.js';

const app = express();
app.use(cookieParser());
const server = http.Server(app);
const port = process.env.PORT || 8000;
const io = new Server(server, {
  cookie: true,
  cors: {
    origin: 'http://127.0.0.1:5500',
    credentials: true,
  },
});

server.listen(port, () => {
  console.log('listening on *:' + port);
});

db.connect(error => {
  if (error) {
    console.log(error);
    next(error);
  }
  console.log('DB connected');
});

app.use(express.json());
app.use(cookieParser());

io.on('connection', socket => {
  console.log('client connected');
  //getComments
  commentsController.getComments(socket);
  //addComment
  socket.on('add_comment', data => {
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
});

app.use((__, res, ___) => {
  console.error(error);
  return res.status(404).send('Not found');
});

app.use((error, __, res, ___) => {
  console.error(error);
  return res.status(500).send('Server error');
});
