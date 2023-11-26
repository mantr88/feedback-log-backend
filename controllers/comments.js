import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import uploadImg from '../helpers/cloudinary.js';
import upload from '../middlewares/upload.js';

const { ACCESS_SECRET_KEY } = process.env;

class CommentsController {
  async getComments(socket) {
    try {
      const query = 'SELECT * FROM comments';
      db.query(query, (error, data) => {
        if (error) return socket.emit('error', `It's happend next error ${error}`);
        if (!data.length) {
          return res.status(409).json('No comments yet');
        }
        socket.emit('get_all_comments', JSON.stringify(data));
      });
    } catch (error) {
      next(error);
    }
  }
  async addComment(data, socket) {
    try {
      const { token } = socket.handshake.auth;
      const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
      const { username, email, home_page, text } = JSON.parse(data);
      console.log(data);
      let img = null;

      upload.single('image')(data, socket.handshake.res, async error => {
        if (error) {
          socket.emit('error', `Error uploading image: ${error}`);
          return;
        }
      });

      console.log(socket.handshake.file);

      if (socket.handshake.file) {
        const { url } = await uploadImg(socket.handshake.file.path);
        img = url;
      }

      // if (req.file) {
      //   const { url } = await uploadImg(req.file.path);
      //   img = url;
      // }

      //       const queryForFetchUserData = `SELECT username, email, home_page FROM users WHERE id = ?
      // `;
      const q =
        'INSERT INTO comments (`username`, `email`, `home_page`, `text`, `img`, `uid`) VALUES (?);';
      const values = [username, email, home_page, text, img, id];
      db.query(q, [values], error => {
        if (error) return socket.emit('error', `It's happend next error ${error}`);
        return socket.emit('add_comment_response', JSON.stringify(values));
      });
    } catch (error) {
      socket.emit('error', `It's happend next error ${error}`);
    }
  }
}

export default new CommentsController();
