import express from 'express';
import commentsController from '../controllers/comments.js';
import validateBody from '../middlewares/validateBody.js';
import commentSchema from '../schemas/commentSchema.js';
import upload from '../middlewares/upload.js';
import authenticate from '../middlewares/authenticate.js';

const uploadFile = upload.single('img');

const router = express.Router();

router.get('/', commentsController.getComments);
router.get('/:id', commentsController.fetchedComment);
router.post(
  '/',
  authenticate,
  uploadFile,
  validateBody(commentSchema),
  commentsController.addComment,
);

export default router;
