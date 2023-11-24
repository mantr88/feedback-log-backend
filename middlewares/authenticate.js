import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const { ACCESS_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json('Not authorized');
    }
    const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (error, data) => {
      if (error) return next(error);
      if (data.length === 0) {
        return res.status(404).json('User not found!');
      }
    });

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
