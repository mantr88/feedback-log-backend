import Joi from 'joi';

const loginUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export default loginUserSchema;
