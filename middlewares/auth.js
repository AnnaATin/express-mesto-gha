const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_KEY = 'my-secret-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Нужно авторизоваться'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    next(new UnauthorizedError('Нужно авторизоваться'));
  }
  req.user = payload;
  next();
};
