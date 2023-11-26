import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const { ACCESS_SECRET_KEY } = process.env;

class AuthController {
  async register(data, socket) {
    try {
      const { email, username, password } = JSON.parse(data);
      const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
      db.query(query, [email, username], async (error, data) => {
        if (error) return socket.emit('error', `It's happend next error ${error}`);
        if (data.length) {
          return socket.emit('register_response', 'User already exists!');
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const q = 'INSERT INTO users(`username`,`email`,`password`) VALUES (?)';
        const values = [username, email, hashPassword];
        db.query(q, [values], (error, data) => {
          if (error) return socket.emit('error', `It's happend next error ${error}`);
          socket.emit('register_response', 'User has been created');
        });
      });
    } catch (error) {
      socket.emit('error', `It's happend next error ${error}`);
    }
  }
  async login(data, socket) {
    try {
      const { username, password } = JSON.parse(data);
      const query = 'SELECT * FROM users WHERE username = ?';
      db.query(query, [username], (error, data) => {
        if (error) return socket.emit('error', `It's happend next error ${error}`);
        if (data.length === 0) {
          return socket.emit('login_response', 'User not found!');
        }
        const isPasswordCorrect = bcrypt.compareSync(password, data[0].password);

        if (!isPasswordCorrect) return socket.emit('login_response', 'Wrong user name or password');

        const token = jwt.sign({ id: data[0].id }, ACCESS_SECRET_KEY, { expiresIn: '23h' });

        const userDTO = {
          username: data[0].username,
          email: data[0].email,
          token: token,
        };
        socket.handshake.auth = { token };
        socket.emit('login_response', JSON.stringify(userDTO));
      });
    } catch (error) {
      next(error);
    }
  }
  // async logout(req, res) {
  //   try {
  //     res
  //       .clearCookie('access_token', { sameSite: 'none', secure: true })
  //       .status(200)
  //       .json('User has been logged out');
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default new AuthController();
