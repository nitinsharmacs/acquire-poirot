const assert = require('assert');
const { Corporation } = require('../../src/models/corporation.js');

const addTiles = (tileIds, corporation) => {
  tileIds.forEach(id => corporation.addTiles([{ id }]));
};

describe('Corporation', () => {
  const corporation = new Corporation({ id: 'hydra', name: 'Hydra' });
  it('Should return true when particular no of stocks are available', () => {
    const actual = corporation.areStocksAvailable(1);
    assert.strictEqual(actual, true);
  });

  it('Should return false when particular no of stocks are not available',
    () => {
      const actual = corporation.areStocksAvailable(26);
      assert.strictEqual(actual, false);
    });

  it('Should increase no of stocks of corporation',
    () => {
      corporation.addStocks(1);
      assert.strictEqual(corporation.stocksLeft, 26);
    });

  it('Should decrease no of stocks of corporation',
    () => {
      const corporation = new Corporation({ id: 'zeta', name: 'Zeta' });
      corporation.reduceStocks(1);
      assert.strictEqual(corporation.stocksLeft, 24);
    });

  it('Should add tiles to corporation',
    () => {
      const corporation = new Corporation({ id: 'zeta', name: 'Zeta' });
      const tiles = [{ label: '1A', id: '1a', placed: true }];
      corporation.addTiles(tiles);
      assert.deepStrictEqual(corporation.tiles, tiles);
    });

  it('should check if corporation has the given tile id', () => {
    const corporation = new Corporation({ id: 'zeta', name: 'Zeta' });
    const tiles = [{ label: '1A', id: '1a', placed: true }];
    corporation.addTiles(tiles);
    assert.ok(corporation.hasTile('1a'));
    assert.strictEqual(corporation.hasTile('2a'), false);
  });

  it('should check corporation is stable or not', () => {
    const corporation1 = new Corporation({ id: 'zeta', name: 'Zeta' });
    corporation1.determineIfSafe();
    assert.strictEqual(corporation1.isSafe(), false);

    const corporation2 = new Corporation({ id: 'america', name: 'America' });
    addTiles(['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12a'], corporation2);
    corporation2.determineIfSafe();
    assert.ok(corporation2.isSafe());
  });

  it('should defunct a corporation', () => {
    const corporation = new Corporation({ id: 'zeta', name: 'Zeta' });
    addTiles(['1a', '2a'], corporation);
    assert.strictEqual(corporation.active, false);
    corporation.activate();
    assert.strictEqual(corporation.active, true);
    corporation.defunct();
    assert.strictEqual(corporation.active, false);
    assert.strictEqual(corporation.getSize(), 0);
  });

});
