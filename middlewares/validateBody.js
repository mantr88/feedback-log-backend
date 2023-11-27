const validateBody = (schema, data) => {
  const { error } = schema.validate(data);
  if (error) {
    throw new Error('missing required field or entered data do not respond requirements');
  }
};

export default validateBody;
