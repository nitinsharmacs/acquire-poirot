const restrict = (req, res, next) => {
  next();
};

module.exports = { restrict };
