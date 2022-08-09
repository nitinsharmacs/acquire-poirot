const serveGamePage = ({ gameTemplatePath }, fs) => {
  const gamePage = fs.readFileSync(gameTemplatePath, 'utf8');

  return (req, res, next) => {
    res.type('text/html');
    res.end(gamePage);
  };
};

module.exports = { serveGamePage };
