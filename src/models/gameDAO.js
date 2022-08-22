const createPlayerDAO = (player = {}) => {
  return { id: player.id, name: player.name };
};

const createPlayersDAO = players => players.map(createPlayerDAO);

const createTurnDAO = (turn = {}) => {
  return {
    ...turn,
    player: createPlayerDAO(turn.player)
  };
};

const createGameDAO = (game, playerId) => {
  const gameDAO = {
    player: game.getPlayer(playerId),
    players: createPlayersDAO(game.players),
    board: game.board,
    cluster: game.cluster,
    logs: game.logs,
    corporations: game.corporations,
    gameSize: game.gameSize,
    started: game.started,
    informationCard: game.informationCard,
    turn: createTurnDAO(game.turn)
  };

  return gameDAO;
};

module.exports = { createGameDAO };
