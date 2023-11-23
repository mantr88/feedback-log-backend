import express from 'express';
import dotenv from 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import { db } from './db.js';
import authRoutes from './routes/auth.js';
import commentsRoutes from './routes/comments.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentsRoutes);

app.listen(2222, () => {
  console.log('Server run');
});

db.connect(error => {
  if (error) {
    console.log(error);
    next(error);
  }
  console.log('DB connected');
});

app.use((__, res, ___) => {
  console.error(error);
  return res.status(404).send('Not found');
});

app.use((error, __, res, ___) => {
  console.error(error);
  return res.status(500).send('Server error');
});
