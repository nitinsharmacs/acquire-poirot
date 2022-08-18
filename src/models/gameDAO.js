const { getPlayer } = require('../utils/game');

const playerDAO = (player) => {
  return {
    ...player,
    game: undefined
  };
};

const otherPlayerDAO = (player = {}) => {
  return {
    id: player.id,
    name: player.name
  };
};

const createPlayersDAO = (players) => players.map(otherPlayerDAO);

const createTurnDAO = (turn = {}) => {
  return {
    ...turn,
    player: otherPlayerDAO(turn.player)
  };
};

const createGameDAO = (game, playerId) => {
  const gameDAO = {
    player: playerDAO(getPlayer(game.players, playerId)),
    players: createPlayersDAO(game.players),
    board: game.board,
    cluster: game.cluster,
    logs: game.logs,
    currentPlayer: otherPlayerDAO(game.currentPlayer),
    corporations: game.corporations,
    gameSize: game.gameSize,
    started: game.started,
    informationCard: game.informationCard,
    turn: createTurnDAO(game.turn)
  };

  return gameDAO;
};

module.exports = { createGameDAO };
