import express from 'express';
import dotenv from 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import { db } from './db.js';
import authRoutes from './routes/auth.js';
// import commentsRoutes from './routes/comments.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
// app.use('/api/comments', commentsRoutes);ß

app.listen(2222, () => {
  console.log('Server run');
});

db.connect(error => {
  if (error) console.log(error);
  console.log('Connected DB');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message, stack: err.stack });
});
