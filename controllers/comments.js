import jwt from 'jsonwebtoken';
import { writeFile } from 'fs';
import { promisify } from 'util';
import { db } from '../db.js';
import uploadImg from '../helpers/cloudinary.js';
import validateBody from '../middlewares/validateBody.js';
import commentSchema from '../schemas/commentSchema.js';

const { ACCESS_SECRET_KEY } = process.env;

class CommentsController {
  async getComments(socket) {
    try {
      const query =
        'SELECT  c.id, c.text, c.date, c.img, u.username , u.email , u.home_page FROM comments AS c INNER JOIN users u ON u.id = c.uid;';
      db.query(query, (error, data) => {
        if (error) return socket.emit('error', `It's happend next error ${error}`);
        if (!data.length) {
          return socket.emit('add_comment_response', 'No comments yet');
        }
        socket.emit('get_all_comments', JSON.stringify(data));
      });
    } catch (error) {
      next(error);
    }
  }
  async addComment(data, socket) {
    try {
      const { text } = data;
      validateBody(commentSchema, { text });

      const { token } = socket.handshake.auth;
      const { id } = jwt.verify(token, ACCESS_SECRET_KEY);

      let img = null;
      if (data.image) {
        const fileExtension = 'png';
        const filePath = `./tmp/upload.${fileExtension}`;
        const writeFileAsync = promisify(writeFile);

        await writeFileAsync(filePath, data.image, err => {
          if (err) {
            socket.emit('error', `Помилка запису файлу: ${err}`);
            return;
          }
        });

        const { url } = await uploadImg(filePath);
        img = url;
      }

      const q = 'INSERT INTO comments ( `text`, `img`, `uid`) VALUES (?);';

      const values = [text, img, id];
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
