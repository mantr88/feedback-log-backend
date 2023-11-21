import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const { ACCESS_SECRET_KEY } = process.env;

class AuthController {
  async register(req, res, next) {
    try {
      const { email, username, password } = req.body;
      const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
      db.query(query, [email, username], async (error, data) => {
        if (error) return res.json(error);
        if (data.length) {
          return res.status(409).json('User already exists!');
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const q = 'INSERT INTO users(`username`,`email`,`password`) VALUES (?)';
        const values = [username, email, hashPassword];
        db.query(q, [values], (error, data) => {
          if (error) return res.json(error);
          return res.status(200).json('User has been created.');
        });
      });
    } catch (error) {
      next(error);
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const query = 'SELECT * FROM users WHERE username = ?';
      db.query(query, [username], (error, data) => {
        if (error) return res.json(error);
        if (data.length === 0) {
          return res.status(404).json('User not found!');
        }
        const isPasswordCorrect = bcrypt.compareSync(password, data[0].password);

        if (!isPasswordCorrect) return res.status(400).json('Wrong user name or password');

        const token = jwt.sign({ id: data[0].id }, ACCESS_SECRET_KEY, { expiresIn: '23h' });

        // const qSaveToken = `UPDATE users SET access_token = ? WHERE id = ${data[0].id}`;
        // // const values = token;
        // db.query(qSaveToken, [token], (error, data) => {
        //   if (error) return res.json(error);
        //   console.log('token succefily writed');
        // });
        const userDTO = {
          username: data[0].username,
          email: data[0].email,
        };

        res
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(userDTO);
      });
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res) {
    try {
      res
        .clearCookie('access_token', { sameSite: 'none', secure: true })
        .status(200)
        .json('User has been logged out');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
