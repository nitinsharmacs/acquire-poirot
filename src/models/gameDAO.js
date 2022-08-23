const createPlayerDAO = (player = {}) => {
  return { id: player.id, name: player.name };
};

const createPlayersDAO = players => players.map(createPlayerDAO);

const createTurnDAO = (currentPlayer, turn = {}) => {
  return {
    ...turn,
    player: createPlayerDAO(currentPlayer)
  };
};

const createGameDAO = (game, playerId) => {
  const gameDAO = {
    player: game.getPlayer(playerId),
    players: createPlayersDAO(game.players),
    board: game.board,
    cluster: game.cluster,
    logs: game.logs.logs,
    corporations: game.corporations,
    gameSize: game.gameSize,
    started: game.started,
    informationCard: game.informationCard,
    turn: createTurnDAO(game.currentPlayer, game.turn)
  };

  return gameDAO;
};

module.exports = { createGameDAO };
