const notFound = (req, res) => {
  res.status(404);
  res.render('notFound', { isNotFoundPage: true });
};

module.exports = { notFound };
