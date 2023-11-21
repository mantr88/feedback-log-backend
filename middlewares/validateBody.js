const validateBody = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: 'missing required field or entered data do not respond requirements' });
    } else {
      next();
    }
  };
};

export default validateBody;
