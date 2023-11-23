import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import uploadImg from '../helpers/cloudinary.js';

const { ACCESS_SECRET_KEY } = process.env;

class CommentsController {
  async getComments(req, res, next) {
    try {
      const query = 'SELECT * FROM comments';
      db.query(query, (error, data) => {
        if (error) return next(error);
        if (!data.length) {
          return res.status(409).json('No comments yet');
        }
        return res.status(200).json(data);
      });
    } catch (error) {
      next(error);
    }
  }
  async fetchedComment(req, res, next) {
    try {
      const { id } = req.params;
      const query = `SELECT * FROM comments WHERE id= ?`;
      const value = id;
      db.query(query, [value], (error, data) => {
        if (error) return next(error);
        if (!data.length) {
          return res.status(409).json(`No comments with id ${id}`);
        }
        return res.status(200).json(data);
      });
    } catch (error) {
      next(error);
    }
  }
  async addComment(req, res, next) {
    try {
      const token = req.cookies.access_token;
      const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
      const { username, email, home_page, text } = req.body;

      let img = null;
      if (req.file) {
        const { url } = await uploadImg(req.file.path);
        img = url;
      }

      const queryForFetchUserData = `SELECT username, email, home_page FROM users WHERE id = ?
`;
      const q =
        'INSERT INTO comments (`username`, `email`, `home_page`, `text`, `img`, `uid`) VALUES (?);';
      const values = [username, email, home_page, text, img, id];
      db.query(q, [values], error => {
        if (error) return next(error);
        return res.status(201).json('Comment succesfuly created');
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentsController();
