import Joi from 'joi';

const commentSchema = Joi.object({
  text: Joi.string().required(),
});

export default commentSchema;
