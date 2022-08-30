const assert = require('assert');
const { Player } = require('../../src/models/player');
const { newGame } = require('../../src/models/game');

const addTiles = (tileIds, corporation) => {
  tileIds.forEach(id => corporation.addTiles([{ id }]));
};

const placeTiles = (game, tileIds) => tileIds.forEach((id) => game
  .placeTile({ id }));

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

  describe('removeDeadTiles', () => {
    let game;
    before(() => {
      game = newGame('123', { id: '213', name: 'sam' }, 1);
      const host = new Player({ id: '123', name: 'sam' });
      game.addPlayer(host);
      game.start();

      const corporation1 = game.findCorporation('america');
      const corporation1Tiles = ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a'];
      addTiles(corporation1Tiles, corporation1);
      corporation1.activate();
      corporation1.determineIfSafe();

      const corporation2 = game.findCorporation('zeta');
      const corporation2Tiles = ['1c', '1d', '1e', '1f', '1g', '1h', '1i', '2d', '2e', '2f', '2g'];
      addTiles(corporation2Tiles, corporation2);
      corporation2.activate();
      corporation2.determineIfSafe();

      placeTiles(game, [...corporation1Tiles, ...corporation2Tiles]);
    });

    it('Should remove dead tiles from the cluster', () => {
      assert.strictEqual(game.cluster.length, 108);
      game.removeDeadTiles();
      assert.strictEqual(game.cluster.length, 107);
      const removableTile = game.cluster.find(tile => tile.id === '1b');
      assert.strictEqual(removableTile, undefined);
    });
  });

  describe('isDeadTile', () => {
    let game;
    before(() => {
      game = newGame('123', { id: '213', name: 'sam' }, 1);
      const host = new Player({ id: '123', name: 'sam' });
      game.addPlayer(host);
      game.start();

      const corporation1 = game.findCorporation('america');
      const corporation1Tiles = ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a'];
      addTiles(corporation1Tiles, corporation1);
      corporation1.activate();
      corporation1.determineIfSafe();

      const corporation2 = game.findCorporation('zeta');
      const corporation2Tiles = ['1c', '1d', '1e', '1f', '1g', '1h', '1i', '2d', '2e', '2f', '2g'];
      addTiles(corporation2Tiles, corporation2);
      corporation2.activate();
      corporation2.determineIfSafe();

      placeTiles(game, [...corporation1Tiles, ...corporation2Tiles]);
    });

    it('Should validate when given tile is dead', () => {
      assert.ok(game.isDeadTile({ id: '1b' }));
    });

    it('Should invalidate when given tile is playable', () => {
      assert.strictEqual(game.isDeadTile({ id: '2b' }), false);
    });
  });

  describe('exchangeDeadTiles', () => {
    let game;
    let host;
    before(() => {
      game = newGame('123', { id: '213', name: 'sam' }, 1);
      host = new Player({ id: '123', name: 'sam' });
      game.addPlayer(host);
      game.start();

      host.addTile({ id: '1b' });

      const corporation1 = game.findCorporation('america');
      const corporation1Tiles = ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a'];
      addTiles(corporation1Tiles, corporation1);
      corporation1.activate();
      corporation1.determineIfSafe();

      const corporation2 = game.findCorporation('zeta');
      const corporation2Tiles = ['1c', '1d', '1e', '1f', '1g', '1h', '1i', '2d', '2e', '2f', '2g'];
      addTiles(corporation2Tiles, corporation2);
      corporation2.activate();
      corporation2.determineIfSafe();

      placeTiles(game, [...corporation1Tiles, ...corporation2Tiles]);
    });

    it('Should exchange player\'s dead tiles', () => {
      const numOfTiles = host.tiles.length;
      game.removeDeadTiles();
      game.exchangeDeadTiles();
      assert.strictEqual(host.findTile('1b'), undefined);
      assert.strictEqual(host.tiles.length, numOfTiles);
    });
  });
});
