const { notFoundPage } = require('../views/notFound.js');

const notFound = (req, res) => {
  res.type('text/html');
  res.send(notFoundPage());
};

module.exports = { notFound };
