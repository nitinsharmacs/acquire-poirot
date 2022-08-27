const createGame = (req, res) => {
  const { playerId, playerName } = req.session;
  if (!playerId) {
    return res.redirect('/login?ref=host');
  }
  res.render('hostPage', { playerName });
};

module.exports = { createGame };
