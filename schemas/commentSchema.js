import Joi from 'joi';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const commentSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  home_page: Joi.string(),
  text: Joi.string().required(),
  img: Joi.string().allow('').optional(),
});

export default commentSchema;
