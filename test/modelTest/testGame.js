const { Games } = require('../../src/models/games');
const { newGame } = require('../../src/models/game');

const assert = require('assert');
const { Player } = require('../../src/models/player');

describe('Game', () => {
  describe('addPlayer', () => {
    it('should add a player into the game', () => {
      const game = newGame('123', { id: '213', name: 'sam' }, 3);
      const host = new Player('213', 'sam', game);

      const player = new Player('32', 'harry', game);
      game.addPlayer(host);
      game.addPlayer(player);

      const expected = [host, player];

      const actual = game.getPlayers();

      assert.deepStrictEqual(actual, expected);
    });
  });

  // describe('reorder', () => {
  //   it('should reorder the players by their tiles', () => {
  //     const game = newGame('123', { id: '213', name: 'sam' }, 3);
  //     const host = new Player('213', 'sam', game);

  //     const player = new Player('32', 'harry', game);
  //     game.addPlayer(host);
  //     game.addPlayer(player);

  //     const hostTile = host.getTile();
  //     const playerTile = player.getTile();

  //     game.reorder();
  //     const actual = game.getPlayers();
  //     const expected = [host, player];

  //     assert.deepStrictEqual();
  //   });
  // });
});
