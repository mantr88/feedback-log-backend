import express from 'express';
import commentsController from '../controllers/comments.js';

const router = express.Router();

router.get('/', commentsController.getComments);
router.get('/:id', commentsController.fetchedComment);
router.post('/', commentsController.addComment);

export default router;
