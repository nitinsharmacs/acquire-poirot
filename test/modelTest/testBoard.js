const assert = require('assert');
const { createBoard } = require('../../src/models/board');

describe('Board', () => {
  it('should place a tile', () => {
    const board = createBoard();
    const expected = { label: '1A', id: '1a', placed: true };
    const actual = board.placeTile('1a');

    assert.deepStrictEqual(actual, expected);
  });

  it('should build a corporation on tile', () => {
    const board = createBoard();
    const corporation = { id: 'america', name: 'America' };

    board.placeTile('1a');
    board.buildCorporation({ id: '1a' }, corporation);

    const expected = {
      label: '1A',
      id: '1a',
      placed: true,
      corporation: { id: 'america', name: 'America' }
    };
    const actual = board.tiles[0];
    assert.deepStrictEqual(actual, expected);
  });
});
