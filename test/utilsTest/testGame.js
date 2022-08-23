const assert = require('assert');
const { newGame } = require('../../src/models/game.js');
const { Player } = require('../../src/models/player.js');
const { findAdjancetTiles,
  nextStep,
  findTilesChain,
  createTiles,
  computeBonus,
  findMajorityMinority
} = require('../../src/utils/game.js');

const placeTile = (tiles, tilePositions) => {
  tilePositions.forEach(position => {
    tiles[position].placed = true;
  });
};

describe('findAdjacentTiles', () => {
  const tiles = createTiles();

  it('Should give 4 adjancent tiles of any middle tile on board', () => {
    const expected = [
      { label: '2B', id: '2b', placed: false },
      { label: '4B', id: '4b', placed: false },
      { label: '3A', id: '3a', placed: false },
      { label: '3C', id: '3c', placed: false }
    ];
    assert.deepStrictEqual(findAdjancetTiles('3b', tiles), expected);
  });

  it('Should give 3 adjancent tiles of middle top row tile', () => {
    const expected = [
      { label: '2A', id: '2a', placed: false },
      { label: '4A', id: '4a', placed: false },
      { label: '3B', id: '3b', placed: false },
    ];
    assert.deepStrictEqual(findAdjancetTiles('3a', tiles), expected);
  });

  it('Should give 3 adjancent tiles of middle bottom row tile', () => {
    const expected = [
      { label: '2I', id: '2i', placed: false },
      { label: '4I', id: '4i', placed: false },
      { label: '3H', id: '3h', placed: false },
    ];
    assert.deepStrictEqual(findAdjancetTiles('3i', tiles), expected);
  });

  it('Should give 3 adjancent tiles of middle left column tile', () => {
    const expected = [
      { label: '2E', id: '2e', placed: false },
      { label: '1D', id: '1d', placed: false },
      { label: '1F', id: '1f', placed: false },
    ];
    assert.deepStrictEqual(findAdjancetTiles('1e', tiles), expected);
  });

  it('Should give 3 adjancent tiles of middle right column tile', () => {
    const expected = [
      { label: '11D', id: '11d', placed: false },
      { label: '12C', id: '12c', placed: false },
      { label: '12E', id: '12e', placed: false },
    ];
    assert.deepStrictEqual(findAdjancetTiles('12d', tiles), expected);
  });

  it('Should give 2 adjancent tiles of top left corner tile ', () => {
    const expected = [
      { label: '2A', id: '2a', placed: false },
      { label: '1B', id: '1b', placed: false },
    ];
    assert.deepStrictEqual(findAdjancetTiles('1a', tiles), expected);
  });

  it('Should give 2 adjancent tiles of bottom left corner tile ', () => {
    const expected = [
      { label: '2I', id: '2i', placed: false },
      { label: '1H', id: '1h', placed: false },
    ];
    assert.deepStrictEqual(findAdjancetTiles('1i', tiles), expected);
  });

  it('Should give 2 adjancent tiles of top right corner tile ', () => {
    const expected = [
      { label: '11A', id: '11a', placed: false },
      { label: '12B', id: '12b', placed: false },
    ];
    assert.deepStrictEqual(findAdjancetTiles('12a', tiles), expected);
  });

  it('Should give 2 adjancent tiles of bottom right corner tile ', () => {
    const expected = [
      { label: '11I', id: '11i', placed: false },
      { label: '12H', id: '12h', placed: false },
    ];
    assert.deepStrictEqual(findAdjancetTiles('12i', tiles), expected);
  });
});

describe('nextStep', () => {
  it('Should determine next move as no effect after placing a tile', () => {
    const game = newGame('game1234', new Player('user123', 'sam'), 3);
    game.start();

    assert.deepStrictEqual(nextStep(game, '2d'), { step: 'noEffect' });
  });

  it('Should determine next move as build co. after placing a tile', () => {
    const game = newGame('game1234', new Player('user123', 'sam'), 3);
    game.board.tiles[2].placed = true;
    game.board.tiles[3].placed = true;

    game.start();
    assert.deepStrictEqual(nextStep(game, '4a'), { step: 'build' });
  });

  it('Should determine next move as grow corporation', () => {
    const game = newGame('game1234', { id: 'user123', name: 'user' }, 3);
    const player = new Player('user123', 'user');

    game.addPlayer(player);
    game.board.tiles[2].placed = true;
    game.board.tiles[3].placed = true;
    const corporation = game.buildCorporation('america', '4a', 'user123');

    const tiles = [
      {
        'id': '5a',
        'label': '5A',
        'placed': false
      },
      {
        'id': '4a',
        'label': '4A',
        'placed': true
      },
      {
        'id': '3a',
        'label': '3A',
        'placed': true
      }
    ];
    game.start();
    assert.deepStrictEqual(nextStep(game, '5a'), {
      step: 'grow',
      corporations: [corporation], tiles
    });
  });

  it('Should determine next move as merge corporations', () => {
    const game = newGame('game1234', { id: 'user123', name: 'user' }, 3);
    const player = new Player('user123', 'user');

    game.addPlayer(player);
    game.board.tiles[2].placed = true;
    game.board.tiles[3].placed = true;
    game.board.tiles[5].placed = true;
    game.board.tiles[6].placed = true;

    const corporation1 = game.buildCorporation('america', '4a', 'user123');
    const corporation2 = game.buildCorporation('zeta', '6a', 'user123');
    const corporations = [corporation1, corporation2];

    const tiles = [
      {
        'id': '5a',
        'label': '5A',
        'placed': false
      },
      {
        'id': '4a',
        'label': '4A',
        'placed': true
      },
      {
        'id': '6a',
        'label': '6A',
        'placed': true
      },
      {
        'id': '3a',
        'label': '3A',
        'placed': true
      },
      {
        'id': '7a',
        'label': '7A',
        'placed': true
      }
    ];
    game.start();
    assert.deepStrictEqual(nextStep(game, '5a'), {
      step: 'merge',
      corporations, tiles
    });
  });
});

describe('findTilesChain', () => {
  it('should find tiles chain for no other adjacent placed tiles', () => {
    const tiles = createTiles();

    const expected = [
      { label: '2A', id: '2a', placed: false }
    ];

    assert.deepStrictEqual(findTilesChain('2a', tiles), expected);
  });

  it('should find the chain of placed tiles of a tile', () => {
    const tiles = createTiles();
    placeTile(tiles, [0, 1]);

    const expected = [
      { label: '3A', id: '3a', placed: false },
      { label: '2A', id: '2a', placed: true },
      { label: '1A', id: '1a', placed: true },
    ];

    assert.deepStrictEqual(findTilesChain('3a', tiles), expected);
  });

  it('should find tiles chain from two separate tiles chains', () => {
    const tiles = createTiles();
    placeTile(tiles, [0, 2, 3, 12]);

    const expected = [
      { label: '2A', id: '2a', placed: false },
      { label: '1A', id: '1a', placed: true },
      { label: '3A', id: '3a', placed: true },
      { label: '1B', id: '1b', placed: true },
      { label: '4A', id: '4a', placed: true },
    ];
    assert.deepStrictEqual(findTilesChain('2a', tiles), expected);
  });

  it('should find tiles chain surrounded one side with placed tiles', () => {
    const tiles = createTiles();
    placeTile(tiles, [0, 2, 12, 13, 14]);
    const expected = [
      { label: '2A', id: '2a', placed: false },
      { label: '1A', id: '1a', placed: true },
      { label: '3A', id: '3a', placed: true },
      { label: '2B', id: '2b', placed: true },
      { label: '1B', id: '1b', placed: true },
      { label: '3B', id: '3b', placed: true },
    ];
    assert.deepStrictEqual(findTilesChain('2a', tiles), expected);
  });

  it('should find tiles chain surrounded with placed tiles', () => {
    const tiles = createTiles();
    placeTile(tiles, [0, 1, 2, 12, 14, 24, 25, 26]);

    const expected = [
      { label: '2B', id: '2b', placed: false },
      { label: '1B', id: '1b', placed: true },
      { label: '3B', id: '3b', placed: true },
      { label: '2A', id: '2a', placed: true },
      { label: '2C', id: '2c', placed: true },
      { label: '1A', id: '1a', placed: true },
      { label: '1C', id: '1c', placed: true },
      { label: '3A', id: '3a', placed: true },
      { label: '3C', id: '3c', placed: true }
    ];

    assert.deepStrictEqual(findTilesChain('2b', tiles), expected);
  });
});

describe('computeBonus', () => {
  it('should give majority and minority bonus to a majority holder', () => {
    const stockHolders = [{ id: 'a', stock: { id: 'zeta', count: 4 } }];
    const bonus = { majorityBonus: 100, minorityBonus: 50 };
    const expected = [{ id: 'a', money: 150 }];
    assert.deepStrictEqual(computeBonus(stockHolders, bonus), expected);
  });

  it('should divide majority and minority bonus between majority holders',
    () => {
      const stockHolders = [
        { id: 'a', stock: { id: 'zeta', count: 4 } },
        { id: 'b', stock: { id: 'zeta', count: 4 } }
      ];
      const bonus = { majorityBonus: 100, minorityBonus: 50 };
      const expected = [{ id: 'b', money: 75 }, { id: 'a', money: 75 }];
      assert.deepStrictEqual(computeBonus(stockHolders, bonus), expected);
    });

  it('should give majority & minority bonus to a majority & minority holder',
    () => {
      const stockHolders = [
        { id: 'b', stock: { id: 'zeta', count: 3 } },
        { id: 'a', stock: { id: 'zeta', count: 4 } }
      ];
      const bonus = { majorityBonus: 100, minorityBonus: 50 };
      const expected = [{ id: 'a', money: 100 }, { id: 'b', money: 50 }];
      assert.deepStrictEqual(computeBonus(stockHolders, bonus), expected);
    });

  it('should divide minority bonus between minority holders',
    () => {
      const stockHolders = [
        { id: 'c', stock: { id: 'zeta', count: 3 } },
        { id: 'b', stock: { id: 'zeta', count: 3 } },
        { id: 'a', stock: { id: 'zeta', count: 4 } }
      ];
      const bonus = { majorityBonus: 100, minorityBonus: 50 };
      const expected = [
        { id: 'a', money: 100 },
        { id: 'b', money: 25 },
        { id: 'c', money: 25 }
      ];
      assert.deepStrictEqual(computeBonus(stockHolders, bonus), expected);
    });
});

describe('findMajorityMinority', () => {
  it('should find a majority and minority holder', () => {
    const stockHolders = [
      { id: 'b', stock: { id: 'zeta', count: 3 } },
      { id: 'a', stock: { id: 'zeta', count: 4 } }
    ];
    const expected = {
      majority: [{ id: 'a', stock: { id: 'zeta', count: 4 } }],
      minority: [{ id: 'b', stock: { id: 'zeta', count: 3 } }]
    };
    const actual = findMajorityMinority(stockHolders);
    assert.deepStrictEqual(actual, expected);
  });

  it('should find two majority and a minority holders', () => {
    const stockHolders = [
      { id: 'a', stock: { id: 'zeta', count: 3 } },
      { id: 'b', stock: { id: 'zeta', count: 4 } },
      { id: 'c', stock: { id: 'zeta', count: 4 } }
    ];
    const expected = {
      majority: [
        { id: 'c', stock: { id: 'zeta', count: 4 } },
        { id: 'b', stock: { id: 'zeta', count: 4 } }],
      minority: [{ id: 'a', stock: { id: 'zeta', count: 3 } }]
    };
    const actual = findMajorityMinority(stockHolders);
    assert.deepStrictEqual(actual, expected);
  });

  it('should find a majority and two minority holders', () => {
    const stockHolders = [
      { id: 'a', stock: { id: 'zeta', count: 3 } },
      { id: 'b', stock: { id: 'zeta', count: 3 } },
      { id: 'c', stock: { id: 'zeta', count: 4 } }
    ];
    const expected = {
      majority: [
        { id: 'c', stock: { id: 'zeta', count: 4 } }],
      minority: [
        { id: 'b', stock: { id: 'zeta', count: 3 } },
        { id: 'a', stock: { id: 'zeta', count: 3 } }]
    };
    const actual = findMajorityMinority(stockHolders);
    assert.deepStrictEqual(actual, expected);
  });

  it('should find a majority holders', () => {
    const stockHolders = [{ id: 'a', stock: { id: 'zeta', count: 4 } }];
    const expected = {
      majority: [{ id: 'a', stock: { id: 'zeta', count: 4 } }],
    };
    const actual = findMajorityMinority(stockHolders);
    assert.deepStrictEqual(actual, expected);
  });
});
