const lobbyPage = (noOfPlayers, gameId, gameLink) => {
  return `<html>
    <body> 
      <p> No. of Players : ${noOfPlayers} </P>
      <p> Game Id : ${gameId} </P>
      <p> Game Link: ${gameLink} </P>
    </body>
  </html>
  `;
};

const createGameLink = (host, gameId) => {
  return `http://${host}/lobby/${gameId}`;
};

const hostGame = (req, res) => {
  if (!req.session.isPopulated) {
    res.redirect('/login?ref=host');
    return;
  }

  const { noOfPlayers } = req.body;
  const { host } = req.headers;
  const gameId = new Date().getTime();
  const gameLink = createGameLink(host, gameId);
  res.type('text/html');
  res.end(lobbyPage(noOfPlayers, gameId, gameLink));
};

module.exports = { hostGame };
