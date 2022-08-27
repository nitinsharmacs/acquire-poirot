const { newGame } = require('../../src/models/game');
const assert = require('assert');
const { MergeState } = require('../../src/models/mergeState');
const { Player } = require('../../src/models/player');

describe('MergeState', () => {
  let game;
  const host = new Player('213', 'sam');

  const player1 = new Player({ id: '32', name: 'harry' });
  const player2 = new Player({ id: '22', name: 'sonu' });

  beforeEach(() => {
    game = newGame('123', { id: '213', name: 'sam' }, 3);
    game.addPlayer(host);
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.start();

    const defunctCorp = game.findCorporation('america');
    defunctCorp.addTiles([{ id: '1a' }, { id: '1b' }]);

    const acquiringCorp = game.findCorporation('zeta');
    acquiringCorp.addTiles([{ id: '1e' }, { id: '1d' }]);

    const tiles = [{ id: '1a' }, { id: '1b' }, { id: '1c' }, { id: '1d' }, { id: '1e' }];

    player1.stocks = [{ corporationId: 'america', count: 1 }];
    player2.stocks = [{ corporationId: 'america', count: 2 }];

    game.state = new MergeState(game, { defunctCorp, acquiringCorp }, tiles, game.currentPlayer);
    game.state.addStockHolders();
  });

  it('should change turn to next player', () => {
    const prevPlayerId = game.currentPlayer.id;
    game.state.changeTurn();

    assert.ok(game.currentPlayer.id !== prevPlayerId);
  });

  it('should add stock sum to player\'s money', () => {
    const prevPlayer = game.currentPlayer;
    const prevMoney = prevPlayer.money;
    game.state.sellStocks(2);
    assert.strictEqual(prevPlayer.money, prevMoney + 600);
  });

  it('should add stock sum to player\'s money', () => {
    host.stocks = [{ corporationId: 'america', count: 2 }];
    player1.stocks = [{ corporationId: 'america', count: 2 }];
    player2.stocks = [{ corporationId: 'america', count: 2 }];

    const player = game.currentPlayer;
    game.state.sellStocks(2);
    assert.deepStrictEqual(player.stocks, []);
  });

  it('should change game state to buystocks after merge', () => {
    game.buildCorporation('america', '1a');
    game.buildCorporation('zeta', '1e');
    host.stocks = [{ corporationId: 'america', count: 2 }];
    player1.stocks = [{ corporationId: 'america', count: 2 }];
    player2.stocks = [{ corporationId: 'america', count: 2 }];

    game.state.addStockHolders();
    game.state.count = 3;
    game.state.sellStocks(2);
    game.state.next();
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
    game.state.addStockHolders();
    game.state.count = 3;
    game.state.sellStocks(2);
    game.state.next();
    assert.deepStrictEqual(game.stage, 'draw-tile');
  });
  it('Should order and filter stockholders from game players', () => {
    game.buildCorporation('america', '1a');
    game.buildCorporation('zeta', '1e');
    game.currentPlayer = host;
    host.stocks = [{ corporationId: 'america', count: 3 }];
    player1.stocks = [];
    player2.stocks = [{ corporationId: 'america', count: 2 }];
    assert.deepStrictEqual(game.state.findStockHolders([host, player1, player2]), [host, player2]);
  });
});
