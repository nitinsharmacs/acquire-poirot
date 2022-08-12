const assert = require('assert');
const { createTiles } = require('../../src/utils/createTiles.js');
const { findAdjancetTiles } = require('../../src/utils/game.js');

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

