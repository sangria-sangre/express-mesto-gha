const jwt = require('jsonwebtoken');
const UnauthorizedError401 = require('../errors/UnauthorizedError401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError401('Необходима авторизация.'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'L8Oe+Y9MvT7uAdcjRd6+rA');
  } catch (err) {
    return next(new UnauthorizedError401('Необходима авторизация.'));
  }

  req.user = payload;

  next();
};