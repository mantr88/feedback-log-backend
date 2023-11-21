import express from 'express';
import commentsController from '../controllers/comments.js';
import validateBody from '../middlewares/validateBody.js';
import commentSchema from '../schemas/commentSchema.js';

const router = express.Router();

router.get('/', commentsController.getComments);
router.get('/:id', commentsController.fetchedComment);
router.post('/', validateBody(commentSchema), commentsController.addComment);

export default router;
