import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import HttpError from '../helpers/HttpError.js';

const { ACCESS_SECRET_KEY } = process.env;

class CommentsController {
  async getComments(req, res, next) {
    try {
      const query = 'SELECT * FROM comments';
      db.query(query, (error, data) => {
        if (error) return res.json(error);
        if (!data.length) {
          throw HttpError(409, 'No comments yet');
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
      const query = `SELECT * FROM comments WHERE id=${id}`;
      db.query(query, (error, data) => {
        if (error) return res.json(error);
        if (!data.length) {
          throw HttpError(409, `No comments with id ${id}`);
        }
        return res.status(200).json(data);
      });
    } catch (error) {
      next(error);
    }
  }
  async addComment(req, res) {
    try {
      const token = req.cookies.access_token;
      const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
      const queryForFetchUserData = `SELECT username, email, home_page FROM users WHERE id = ${id}
`;
      const userData = db.query(queryForFetchUserData, (error, data) => {
        if (error) return res.json(error);
        // console.log(data[0]);
        // return data[0];
      });
      return res.json(userData);
      // const q = 'INSERT INTO comments (`text`, `uid`) VALUES (?);';
      // const values=
    } catch (error) {}
  }
  async deleteComment(req, res) {
    res.json('from controller');
  }
  async updateComment(req, res) {
    res.json('from controller');
  }
}

export default new CommentsController();
