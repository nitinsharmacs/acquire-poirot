const { hostPage } = require('../views/hostPage.js');

const createGame = (req, res) => {
  const { playerId, playerName } = req.session;
  if (!playerId) {
    res.redirect('/login?ref=host');
    return;
  }
  const message = '';
  const hostPageTemplate = hostPage(playerName, message);

  res.type('text/html');
  res.send(hostPageTemplate);
};

module.exports = { createGame };
