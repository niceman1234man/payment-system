const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || process.env.SECRET || process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error('JWT secret is not set. Please set `JWT_SECRET` in your .env');
  }
  return jwt.sign({ id, role }, secret, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
