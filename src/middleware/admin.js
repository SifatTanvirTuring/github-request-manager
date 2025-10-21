module.exports = (req, res, next) => {
  if (req.user.username !== process.env.ADMIN_USERNAME) {
    return res.status(403).send('Access Denied: Requires admin privileges');
  }
  next();
};
