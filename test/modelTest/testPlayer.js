const { newGame } = require('../../src/models/game');

const assert = require('assert');
const { Player } = require('../../src/models/player');

describe('Player', () => {
  describe('addTile', () => {
    it('should add tile into player\'s tiles', () => {
      const game = newGame('123', { id: '213', name: 'sam' }, 3);
      const host = new Player('213', 'sam');

      const player = new Player('32', 'harry');
      game.addPlayer(host);
      game.addPlayer(player);
      const tile = { id: '1a', name: '1A' };
      player.addTile(tile);

      assert.ok(player.tiles.find(({ id }) => id === tile.id));
    });
  });

  describe('placeTile', () => {
    it('should place first tile from the player tiles', () => {
      const game = newGame('123', { id: '213', name: 'sam' }, 3);
      const host = new Player('213', 'sam');

      const player = new Player('32', 'harry');
      game.addPlayer(host);
      game.addPlayer(player);

      const tile = { id: '1a', name: '1A' };
      player.addTile(tile);
      player.placeFirstTile();

      assert.ok(player.tiles.find(({ id }) => id === tile.id) === undefined);
    });
  });
});

