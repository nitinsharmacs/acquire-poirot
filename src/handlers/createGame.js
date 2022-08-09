const fs = require('fs');

const serveHostPage = (req, res, hostPage) => {
  const pageContent = hostPage.replace('_MESSAGE_', '');
  res.type('text/html');
  res.end(pageContent);
  return true;
};

const createGame = (dataStore) => (req, res) => {
  if (!req.session.playerId) {
    res.redirect('/login?ref=host');
    return;
  }
  const hostPage = dataStore.load('HOST_TEMPLATE_PATH');
  serveHostPage(req, res, hostPage);
};

module.exports = { createGame };
