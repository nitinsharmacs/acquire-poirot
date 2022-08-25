const createPlayerDAO = (player = {}) => {
  return { id: player.id, name: player.name };
};

const createPlayersDAO = (game) => {
  if (game.isInEndGameStage()) {
    return game.players;
  }
  return game.players.map(createPlayerDAO);
};

const createTurnDAO = (stage, player = {},) => {
  return { stage, playerId: player.id };
};

const createGameDAO = (game, playerId) => {
  const gameDAO = {
    player: game.getPlayer(playerId),
    players: createPlayersDAO(game),
    board: game.board,
    cluster: game.cluster,
    logs: game.logs.logs,
    corporations: game.corporations,
    gameSize: game.gameSize,
    started: game.started,
    informationCard: game.informationCard,
    turn: createTurnDAO(game.stage, game.currentPlayer)
  };

  return gameDAO;
};

module.exports = { createGameDAO };
