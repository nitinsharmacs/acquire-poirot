const { newGame } = require('../../src/models/game');
const assert = require('assert');
const { MergeState } = require('../../src/models/mergeState');
const { Player } = require('../../src/models/player');

describe('MergeState', () => {
  const game = newGame('123', { id: '213', name: 'sam' }, 3);
  const host = new Player('213', 'sam');

  const player1 = new Player({ id: '32', name: 'harry' });
  const player2 = new Player({ id: '22', name: 'sonu' });
  game.addPlayer(host);
  game.addPlayer(player1);
  game.addPlayer(player2);
  game.start();

  const defunctCorp = game.findCorporation('america');
  defunctCorp.addTiles([{ id: '1a' }, { id: '1b' }]);

  const acquiringCorp = game.findCorporation('zeta');
  acquiringCorp.addTiles([{ id: '1e' }, { id: '1d' }]);

  const tiles = [{ id: '1a' }, { id: '1b' }, { id: '1c' }, { id: '1d' }, { id: '1e' }];

  game.state = new MergeState(game, defunctCorp, acquiringCorp, tiles);

  it('should change turn to next player', () => {
    const prevPlayerId = game.currentPlayer.id;
    game.state.changeTurn('merge');

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
    assert.deepStrictEqual(player.stocks, [{ corporationId: 'america', count: 0 }]);
  });
});
