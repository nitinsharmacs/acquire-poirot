const restrict = (req, res, next) => {
  if (req.session.playerId) {
    return next();
  }
  res.redirect('/login');
};

module.exports = { restrict };
