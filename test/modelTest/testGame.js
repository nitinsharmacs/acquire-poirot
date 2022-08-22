const assert = require('assert');
const { Player } = require('../../src/models/player');
const { newGame } = require('../../src/models/game');

describe('Game', () => {
  describe('addPlayer', () => {
    it('should add a player into the game', () => {
      const game = newGame('123', { id: '213', name: 'sam' }, 3);
      const host = new Player('213', 'sam');

      const player = new Player('32', 'harry');
      game.addPlayer(host);
      game.addPlayer(player);

      const expected = [host, player];

      const actual = game.getPlayers();

      assert.deepStrictEqual(actual, expected);
    });
  });
});
