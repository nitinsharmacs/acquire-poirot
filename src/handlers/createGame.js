const fs = require('fs');

const serveHostPage = (req, res, hostPage) => {
  const pageContent = hostPage.replace('_MESSAGE_', '');
  res.type('text/html');
  res.end(pageContent);
  return true;
};

const createGame = ({ hostTemplatePath }) => (req, res) => {
  if (!req.session.playerId) {
    res.redirect('/login?ref=host');
    return;
  }
  const hostPage = fs.readFileSync(hostTemplatePath, 'utf8');
  serveHostPage(req, res, hostPage);
};

module.exports = { createGame };
