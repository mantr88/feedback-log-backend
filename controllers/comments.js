import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const { ACCESS_SECRET_KEY } = process.env;

class CommentsController {
  async getComments(req, res, next) {
    try {
      const query = 'SELECT * FROM comments';
      db.query(query, (error, data) => {
        if (error) return res.json(error);
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
        if (error) return res.json(error);
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
      console.log(id);
      const queryForFetchUserData = `SELECT username, email, home_page FROM users WHERE id = ?
`;
      const idValue = id;
      const userData = db.query(queryForFetchUserData, [idValue], (error, data) => {
        if (error) return res.json(error);
        console.log(data[0]);

        const q =
          'INSERT INTO comments (`username`, `email`, `home_page`, `text`, `img`, `uid`) VALUES (?);';
        const values = [
          data[0].username,
          data[0].email,
          data[0].home_page,
          req.body.text,
          req.body.img,
          id,
        ];
        db.query(q, [values], error => {
          if (error) return res.json(error);
          return res.status(200).json('Comment succesfuly created');
        });
      });
      //
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentsController();
