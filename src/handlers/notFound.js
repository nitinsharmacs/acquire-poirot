const notFound = (req, res) => {
  res.status(404);
  res.type('text/html');
  res.render('notFound', { isNotFoundPage: true });
};

module.exports = { notFound };
