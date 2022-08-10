const restrict = (req, res, next) => {
  if (req.session.playerId) {
    return next();
  }
  res.redirect('/login?ref=' + req.url);
};

module.exports = { restrict };
