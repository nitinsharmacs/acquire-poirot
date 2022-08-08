const serveHostPage = (req, res, hostPage) => {
  res.type('text/html');
  res.end(hostPage);
  return true;
};

const createGame = ({ hostTemplatePath }, fs) => (req, res) => {
  if (!req.session.isPopulated) {
    res.redirect('/login?ref=host');
    return;
  }
  const hostPage = fs.readFileSync(hostTemplatePath, 'utf8');
  serveHostPage(req, res, hostPage);
};

module.exports = { createGame };
