const { totalNumOfStocks } = require('../../src/handlers/gameApi.js');
const assert = require('assert');

describe('totalNumOfStocks', () => {
  it('Should return total number of stocks for a corporation', () => {
    const stocks = [{ corporationId: 'america', numOfStocks: 2 }];

    assert.strictEqual(totalNumOfStocks(stocks), 2);
  });

  it('Should return total number of stocks for multiple corporations', () => {
    const stocks = [
      { corporationId: 'america', numOfStocks: 2 },
      { corporationId: 'hydra', numOfStocks: 5 }
    ];

    assert.strictEqual(totalNumOfStocks(stocks), 7);
  });
});
