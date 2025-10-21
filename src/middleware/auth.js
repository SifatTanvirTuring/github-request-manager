const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).send('Access Denied: No token provided');
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(400).send('Invalid Token: Format is "Bearer <token>"');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send('Access Denied: User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};
