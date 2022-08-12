const { getPlayer } = require('../utils/game');

const playerDAO = (player) => {
  return {
    id: player.id,
    name: player.name,
    tiles: player.tiles
  };
};

const createPlayersDAO = (players) => players.map(playerDAO);

const createGameDAO = (game, playerId) => {
  const gameDAO = {
    player: playerDAO(getPlayer(game.players, playerId)),
    players: createPlayersDAO(game.players),
    board: game.board,
    cluster: game.cluster,
    logs: game.logs,
    currentPlayer: game.currentPlayer ? playerDAO(game.currentPlayer) : {},
    corporations: game.corporations,
    gameSize: game.gameSize
  };

  return gameDAO;
};

module.exports = { createGameDAO };
