const validation = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validateAsync(req.body);
    return next();
  } catch (err) {
    return res
      .status(400)
      .send({ msg: 'Request does not follow validation requirements' });
  }
};

module.exports = validation;
