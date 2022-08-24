const assert = require('assert');
const { Player } = require('../../src/models/player');
const { newGame } = require('../../src/models/game');
const { Corporation } = require('../../src/models/corporation');

describe('Game', () => {
  describe('addPlayer', () => {
    it('should add a player into the game', () => {
      const game = newGame('123', { id: '213', name: 'sam' }, 3);
      const host = new Player('213', 'sam');

      const player = new Player('32', 'harry');
      game.addPlayer(host);
      game.addPlayer(player);

      const expected = [host, player];

      const actual = game.players;

      assert.deepStrictEqual(actual, expected);
    });
  });

  describe('isGameOver', () => {
    it('should validate game is over when all active corporations are safe', () => {
      const game = newGame('123', { id: '213', name: 'sam' }, 2);
      const host = new Player('213', 'sam');

      const player = new Player('32', 'harry');
      game.addPlayer(host);
      game.addPlayer(player);

      const zeta = game.findCorporation('zeta');
      zeta.activate();
      zeta.isSafe = () => true;

      const america = game.findCorporation('america');
      america.activate();
      america.isSafe = () => true;

      assert.ok(game.isGameOver());
    });

    it('should invalidate game over when any of the active corporations is unsafe', () => {
      const game = newGame('123', { id: '213', name: 'sam' }, 2);
      const host = new Player('213', 'sam');

      const player = new Player('32', 'harry');
      game.addPlayer(host);
      game.addPlayer(player);

      const zeta = game.findCorporation('zeta');
      zeta.activate();
      zeta.isSafe = () => true;

      const america = game.findCorporation('america');
      america.activate();

      assert.strictEqual(game.isGameOver(), false);
    });

    it('should validate game over when any of the active corporations has more than 40 tiles', () => {
      const game = newGame('123', { id: '213', name: 'sam' }, 2);
      const host = new Player('213', 'sam');

      const player = new Player('32', 'harry');
      game.addPlayer(host);
      game.addPlayer(player);

      const zeta = game.findCorporation('zeta');
      zeta.activate();
      zeta.addTiles(Array(42).fill('1a'));

      const america = game.findCorporation('america');
      america.activate();

      assert.ok(game.isGameOver());
    });

    it('should invalidate game over when no active corporation has more than 40 tiles', () => {
      const game = newGame('123', { id: '213', name: 'sam' }, 2);
      const host = new Player('213', 'sam');

      const player = new Player('32', 'harry');
      game.addPlayer(host);
      game.addPlayer(player);

      const zeta = game.findCorporation('zeta');
      zeta.activate();
      zeta.addTiles(Array(2).fill('1a'));

      const america = game.findCorporation('america');
      america.activate();

      assert.strictEqual(game.isGameOver(), false);
    });
  });
});
