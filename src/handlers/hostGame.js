const fs = require('fs');

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

const hostGame = ({ hostTemplatePath }) => (req, res) => {
  if (!req.session.playerId) {
    res.redirect('/login?ref=host');
    return;
  }
  const { host } = req.headers;
  const { noOfPlayers } = req.body;

  if (!noOfPlayers) {
    const hostPage = fs.readFileSync(hostTemplatePath, 'utf8');
    const errorHost = hostPage.replace('_MESSAGE_', 'Please enter no of players');
    res.type('text/html');
    res.end(errorHost);
    return;
  }

  const gameId = new Date().getTime();
  const gameLink = createGameLink(host, gameId);
  res.type('text/html');
  res.end(lobbyPage(noOfPlayers, gameId, gameLink));
};

module.exports = { hostGame };
