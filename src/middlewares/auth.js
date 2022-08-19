const restrict = (req, res, next) => {
  if (req.session.playerId) {
    return next();
  }
  res.redirect('/login?ref=' + req.url);
};

const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.playerId) {
    return res.redirect('/');
  }
  next();
};

module.exports = { restrict, redirectIfLoggedIn };
