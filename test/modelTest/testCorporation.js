const assert = require('assert');
const { Corporation } = require('../../src/models/corporation.js');

describe('Corporation', () => {
  const corporation = new Corporation('hydra', 'Hydra');
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
      const corporation = new Corporation('zeta', 'Zeta');
      corporation.reduceStocks(1);
      assert.strictEqual(corporation.stocksLeft, 24);
    });

  it('Should decrease no of stocks of corporation',
    () => {
      const corporation = new Corporation('zeta', 'Zeta');
      const tiles = [{ label: '1A', id: '1a', placed: true }];
      corporation.addTiles(tiles);
      assert.deepStrictEqual(corporation.tiles, tiles);
    });
});
