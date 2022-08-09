const { Games } = require('../../src/models/games');
const { newGame } = require('../../src/models/game');

const assert = require('assert');

describe('Games', () => {
  describe('add', () => {
    it('should add a game into games', () => {
      const games = new Games();
      const host = { name: 'sam', id: 'user' };

      const game = newGame('123', host);
      games.add(game);

      const actual = games.find('123');
      assert.deepStrictEqual(actual, game);
    });
  });

  describe('find', () => {
    it('should find existing game from the games', () => {
      const host = { name: 'sam', id: 'user' };

      const game = newGame('123', host);
      const games = new Games([game]);

      const actual = games.find('123');
      assert.deepStrictEqual(actual, game);
    });
  });
});
