const { newGame } = require('../../src/models/game');
const assert = require('assert');
const { MergeState } = require('../../src/models/mergeState');
const { Player } = require('../../src/models/player');

describe('MergeState', () => {
  let game;
  let mergeState;
  const host = new Player('213', 'sam');

  const player1 = new Player({ id: '32', name: 'harry' });
  const player2 = new Player({ id: '22', name: 'sonu' });

  beforeEach(() => {
    game = newGame('123', { id: '213', name: 'sam' }, 3);
    game.addPlayer(host);
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.start();

    game.placeTile({ id: '1d' });
    game.placeTile({ id: '1b' });
    game.placeTile({ id: '1f' });

    game.buildCorporation('zeta', '1e');
    game.buildCorporation('america', '1a');

    const defunctCorp = game.findCorporation('america');

    const acquiringCorp = game.findCorporation('zeta');

    const tiles = [{ id: '1a' }, { id: '1b' }, { id: '1c' }, { id: '1d' }, { id: '1e' }];

    player1.stocks = [{ corporationId: 'america', count: 1 }];
    player2.stocks = [{ corporationId: 'america', count: 2 }];

    mergeState = new MergeState(game, { defunctCorp, acquiringCorp, rest: [] }, tiles, game.currentPlayer);

    mergeState.addStockHolders();
    game.changeTurn();
  });

  it('should change turn to next player', () => {
    const prevPlayerId = game.currentPlayer.id;
    mergeState.changeTurn();

    assert.ok(game.currentPlayer.id !== prevPlayerId);
  });

  it('should add stock sum to player\'s money', () => {
    const prevPlayer = game.currentPlayer;
    const prevMoney = prevPlayer.money;
    mergeState.sellStocks(2);
    assert.strictEqual(prevPlayer.money, prevMoney + 600);
  });

  it('should reduce the stocks from player\'s stocks', () => {
    host.stocks = [{ corporationId: 'america', count: 2 }];
    player1.stocks = [{ corporationId: 'america', count: 2 }];
    player2.stocks = [{ corporationId: 'america', count: 2 }];

    const player = game.currentPlayer;
    mergeState.sellStocks(2);
    assert.deepStrictEqual(player.stocks, []);
  });

  it('should change game state to buystocks after merge', () => {
    game.buildCorporation('america', '1a');
    game.buildCorporation('zeta', '1e');
    host.stocks = [{ corporationId: 'america', count: 2 }];
    player1.stocks = [{ corporationId: 'america', count: 2 }];
    player2.stocks = [{ corporationId: 'america', count: 2 }];

    mergeState.addStockHolders();
    mergeState.count = 3;
    mergeState.sellStocks(2);
    mergeState.next();
    assert.deepStrictEqual(game.stage, 'buy-stocks');
  });

  it('should change game state to drawTile if no stocks are avaliable after merge', () => {
    game.buildCorporation('america', '1a');
    game.buildCorporation('zeta', '1e');
    host.stocks = [{ corporationId: 'america', count: 2 }];
    player1.stocks = [{ corporationId: 'america', count: 2 }];
    player2.stocks = [{ corporationId: 'america', count: 2 }];

    const zeta = game.findCorporation('zeta');
    zeta.stocksLeft = 0;
    mergeState.addStockHolders();
    mergeState.count = 3;
    mergeState.sellStocks(2);
    mergeState.next();
    assert.deepStrictEqual(game.stage, 'draw-tile');
  });

  it('Should order and filter stockholders from game players', () => {
    game.currentPlayer = host;
    host.stocks = [{ corporationId: 'america', count: 3 }];
    player1.stocks = [];
    player2.stocks = [{ corporationId: 'america', count: 2 }];
    assert.deepStrictEqual(mergeState.findStockHolders([host, player1, player2]), [host, player2]);
  });

  it('Should merge two corporations', () => {
    mergeState.stockHolders = [];
    mergeState.count = 0;
    const defunctCorpTiles = mergeState.defunctCorp.tiles;

    mergeState.next();

    const acquiringCorpTiles = mergeState.acquiringCorp.tiles;
    assert.ok(defunctCorpTiles.every(tile => acquiringCorpTiles.includes(tile)));
  });
});

describe('Merge 2+ corporations', () => {
  let game;
  const host = new Player('213', 'sam');

  const player1 = new Player({ id: '32', name: 'harry' });
  const player2 = new Player({ id: '22', name: 'sonu' });

  beforeEach(() => {
    game = newGame('123', { id: '213', name: 'sam' }, 3);
    const players = [host, player1, player2];
    const _tiles = [{ id: '1d' }, { id: '1b' }, { id: '1f' }, { id: '3c' }];
    const corporations = [['zeta', '1e'], ['america', '1a'], ['hydra', '2c']];

    players.forEach(player => game.addPlayer(player));
    game.start();

    _tiles.forEach(tile => game.placeTile(tile));
    corporations.forEach(([name, id]) => game.buildCorporation(name, id));

    const defunctCorp = game.findCorporation('america');
    const acquiringCorp = game.findCorporation('zeta');
    const rest = [game.findCorporation('hydra')];
    const tiles = [{ id: '1a' }, { id: '1b' }, { id: '1c' }, { id: '1d' }, { id: '1e' }];

    player1.stocks = [{ corporationId: 'america', count: 1 }];
    player2.stocks = [{ corporationId: 'america', count: 2 }];

    game.state = new MergeState(game, { defunctCorp, acquiringCorp, rest }, tiles, game.currentPlayer);

    game.state.addStockHolders();
    game.changeTurn();
  });

  it('Should merge 2 corporations', () => {
    game.state.stockHolders = [];
    game.state.count = 0;
    const america = game.findCorporation('america');
    const hydra = game.findCorporation('hydra');

    game.state.next();

    assert.strictEqual(america.active, false);
    assert.deepStrictEqual(game.state.defunctCorp, hydra);
  });
});
