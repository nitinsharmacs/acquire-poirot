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

  describe('removeTile', () => {
    it('should remove tile from player tiles', () => {
      const player = new Player('32', 'harry');

      const tile = { id: '1a', name: '1A' };
      player.addTile(tile);
      player.removeTile('1a');
      assert.equal(player.tiles.length, 0);
    });
  });

  describe('addStocks', () => {
    it('should add stocks', () => {
      const player = new Player('32', 'harry');
      player.addStocks({ id: 'america', name: 'America' }, 2);
      const expected = [
        {
          corporationId: 'america',
          corporationName: 'America',
          count: 2
        }
      ];
      assert.deepStrictEqual(player.stocks, expected);
    });

    it('should add stocks to existing stocks', () => {
      const player = new Player('32', 'harry');
      player.addStocks({ id: 'america', name: 'America' }, 2);
      player.addStocks({ id: 'america', name: 'America' }, 2);
      const expected = [
        {
          corporationId: 'america',
          corporationName: 'America',
          count: 4
        }
      ];
      assert.deepStrictEqual(player.stocks, expected);
    });
  });

  describe('Transaction', () => {
    let player;
    beforeEach(() => {
      player = new Player('32', 'harry');
      player.addMoney(5000);
    });

    it('should add money to player resources', () => {
      player.addMoney(5000);
      assert.equal(player.money, 10000);
    });

    it('should return money of player', () => {
      const money = player.getMoney();
      assert.equal(money, 5000);
    });

    it('should deduct money from player resources', () => {
      player.deductMoney(2000);
      assert.equal(player.money, 3000);
    });
  });
});

