// Role Middleware Boilerplate
exports.adminOnly = (req, res, next) => {
  // TODO: Check if user is admin
  next();
};
