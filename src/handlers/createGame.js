const serveHostPage = (req, res, hostPage) => {
  res.type('text/html');
  res.end(hostPage);
  return true;
};

const createGame = ({ hostPage }) => (req, res) => {
  if (!req.session.sessionId) {
    res.redirect('/login');
    return;
  }
  serveHostPage(req, res, hostPage);
};

module.exports = { createGame };
