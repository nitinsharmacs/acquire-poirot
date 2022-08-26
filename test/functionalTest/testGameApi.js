const request = require('supertest');
const assert = require('assert');
const { createApp } = require('../../src/app.js');
const Sinon = require('sinon');
const { newGame } = require('../../src/models/game.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');

const placeTiles = (game, tileIds) => tileIds.forEach((id) => game
  .placeTile({ id }));

const addPlayers = (game, players) => {
  players.forEach(({ id, name }) => game.addPlayer(new Player({ id, name })));
};

const session = (gameId, playerId) => () => (req, res, next) => {
  req.session = {};
  req.session.playerId = playerId;
  req.session.gameId = gameId;
  req.session.save = function (cb) {
    res.setHeader('set-cookie', 'connect.sid=23232');
    cb();
  };

  next();
};

const initApp = (session, games) => {
  const config = { session, root: './public', games };
  const dataStore = {
    load: Sinon.stub(),
    loadJSON: Sinon.stub()
  };

  return createApp(config, dataStore);
};

describe('GET /api/loadgame', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  game.addPlayer(new Player({ id: 'user', name: 'sam' }));
  const app = initApp(session('123', 'user'), games);

  it('should response with game data when game started', (done) => {
    game.start();
    request(app)
      .get('/api/loadgame')
      .expect(200)
      .expect('content-type', /^application\/json/, done);
  });
});

// TODO : verify the game is started
describe('POST /api/start-game', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  const players = [
    { id: 'user', name: 'sam' },
    { id: 'user-2', name: 'harry' },
    { id: 'user-3', name: 'nilam' },
    { id: 'user-4', name: 'peter' }];
  addPlayers(game, players);
  const app = initApp(session('123', 'user'), games);

  it('should reorder the player, place tiles and start the game', (done) => {
    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });
});

describe('POST /api/place-tile', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  const players = [
    { id: 'user', name: 'sam' },
    { id: 'user-2', name: 'harry' },
    { id: 'user-3', name: 'nilam' },
    { id: 'user-4', name: 'peter' }];
  addPlayers(game, players);
  const app = initApp(session('123', 'user'), games);

  beforeEach((done) => {
    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });

  it('should remove tile from player\'s tiles and place it on board',
    (done) => {
      game.currentPlayer = game.getPlayer('user');
      const tileId = game.currentPlayer.tiles[0].id;

      request(app)
        .post('/api/place-tile')
        .send(`id=${tileId}`)
        .expect('content-type', /json/)
        .expect(200, done);
    });
});

describe('Post /api/place-tile', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  const players = [
    { id: 'user', name: 'sam' },
    { id: 'user-2', name: 'harry' },
    { id: 'user-3', name: 'nilam' },
    { id: 'user-4', name: 'peter' }];
  addPlayers(game, players);
  const app = initApp(session('123', 'user'), games);

  beforeEach((done) => {
    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });

  it('should grow corporation',
    (done) => {
      game.currentPlayer = game.getPlayer('user');
      const tile = game.board.tiles.find(tile => tile.id === '3a');
      game.currentPlayer.addTile(tile);

      const corporation = game.findCorporation('america');
      placeTiles(game, ['1a', '2a']);
      game.buildCorporation(corporation.id, '1a', 'user');

      const tileId = '3a';
      request(app)
        .post('/api/place-tile')
        .send(`id=${tileId}`)
        .expect('content-type', /json/)
        .expect(200, () => {
          assert.ok(corporation.getSize() >= 3);
          done();
        });
    });
});

describe('Post /api/place-tile', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  const players = [
    { id: 'user', name: 'sam' },
    { id: 'user-2', name: 'harry' },
    { id: 'user-3', name: 'nilam' },
    { id: 'user-4', name: 'peter' }];
  addPlayers(game, players);
  const app = initApp(session('123', 'user'), games);

  beforeEach((done) => {
    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });

  it('Should determine a corporation is safe',
    (done) => {
      game.currentPlayer = game.getPlayer('user');
      const tile = game.board.tiles.find(tile => tile.id === '4b');
      game.currentPlayer.addTile(tile);
      const corporation = game.findCorporation('america');
      placeTiles(game,
        ['1a', '2a', '3a', '1b', '2b', '3b', '1c', '2c', '3c', '1d']);

      game.buildCorporation(corporation.id, '1a', 'user');

      const tileId = '4b';
      request(app)
        .post('/api/place-tile')
        .send(`id=${tileId}`)
        .expect('content-type', /json/)
        .expect(200, () => {
          assert.ok(corporation.getSize() >= 11);
          assert.ok(corporation.isSafe());
          done();
        });
    });

  it('should merge two corporations',
    (done) => {
      game.currentPlayer = game.getPlayer('user');
      const tile = game.board.tiles.find(tile => tile.id === '3a');
      game.currentPlayer.addTile(tile);
      game.currentPlayer.stocks = [{ corporationId: 'america', count: 2 }];

      const corporation1 = game.findCorporation('america');
      placeTiles(game, ['1a', '2a']);
      game.buildCorporation(corporation1.id, '1a', 'user');

      const corporation2 = game.findCorporation('zeta');
      placeTiles(game, ['4a', '5a', '6a']);
      game.buildCorporation(corporation2.id, '4a', 'user');

      const tileId = '3a';
      request(app)
        .post('/api/place-tile')
        .send(`id=${tileId}`)
        .expect('content-type', /json/)
        .expect(200, done);
    });
});

describe('POST /api/draw-tile', () => {
  let currentPlayer;
  const games = new Games();
  beforeEach(done => {
    const host = { name: 'sam', id: 'user' };

    const game = newGame('123', host, 4);
    games.add(game);
    const players = [
      { id: 'user', name: 'sam' },
      { id: 'user-2', name: 'harry' },
      { id: 'user-3', name: 'nilam' }];
    addPlayers(game, players);
    game.players.forEach(player => game.giveTile(player));
    game.setup();
    game.start();

    currentPlayer = game.currentPlayer;
    done();
  });

  it('should draw a tile for the current player', (done) => {
    const app = initApp(session('123', currentPlayer.id), games);

    request(app)
      .post('/api/draw-tile')
      .expect('content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        const playerTile = currentPlayer.tiles[currentPlayer.tiles.length - 1];
        assert.deepStrictEqual(res.body.data, playerTile);
        done();
      });
  });

  it('should not draw tile if player is not playing', (done) => {
    const app = initApp(session('123', 'user-23'), games);
    request(app)
      .post('/api/draw-tile')
      .expect('content-type', /json/)
      .expect(403, done);
  });
});

describe('POST /api/build-corporation', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 1);
  games.add(game);
  game.addPlayer(new Player({ id: 'user', name: 'sam' }));
  const app = initApp(session('123', 'user'), games);

  before((done) => {
    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });

  it('should build a corporation',
    (done) => {
      game.currentPlayer = game.getPlayer('user');
      placeTiles(game, ['1a', '2a']);
      request(app)
        .post('/api/build-corporation')
        .send('id=1a&corporationId=america')
        .expect('content-type', /json/)
        .expect(200, done);
    });
});

describe('POST /api/skip-build', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 1);
  games.add(game);
  game.addPlayer(new Player({ id: 'user', name: 'sam' }));
  const app = initApp(session('123', 'user'), games);

  before((done) => {
    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });

  it('should skip building a corporation',
    (done) => {
      game.currentPlayer = game.getPlayer('user');
      placeTiles(game, ['1a', '2a']);
      game.buyStocksState();

      request(app)
        .post('/api/skip-build')
        .expect('content-type', /json/)
        .expect(200,
          JSON.stringify({
            message: 'skip built corporation',
            data: { case: 'draw-tile' }
          }), done);
    });
});

describe('POST /api/buy-stocks', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 1);
  games.add(game);
  game.addPlayer(new Player({ id: 'user', name: 'sam' }));
  const app = initApp(session('123', 'user'), games);

  beforeEach((done) => {

    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });

  it('should buy stocks',
    (done) => {
      const corporation = game.findCorporation('america');
      corporation.active = true;
      corporation.tiles.push('1a', '1b');
      request(app)
        .post('/api/buy-stocks')
        .set('content-type', 'application/json')
        .send(JSON.stringify({
          stocks: [{
            corporationId: 'america',
            numOfStocks: 2
          }]
        }))
        .expect(200, done);
    });

  it('should buy stocks for multiple corporations',
    (done) => {
      let corporation = game.findCorporation('america');
      corporation.active = true;
      corporation.tiles.push('1a', '1b');

      corporation = game.findCorporation('zeta');
      corporation.active = true;
      corporation.tiles.push('1d', '1f');
      request(app)
        .post('/api/buy-stocks')
        .set('content-type', 'application/json')
        .send(JSON.stringify({
          stocks: [{
            corporationId: 'america',
            numOfStocks: 2
          },
          {
            corporationId: 'zeta',
            numOfStocks: 1
          }]
        }))
        .expect(200, done);
    });

  it('should not buy stocks when limit exceeds',
    (done) => {
      game.buyStocksState();
      request(app)
        .post('/api/buy-stocks')
        .set('content-type', 'application/json')
        .send(JSON.stringify({
          stocks: [{
            corporationId: 'america',
            numOfStocks: 4
          }]
        }))
        .expect(422,
          JSON.stringify({
            message: 'Can buy maximum 3 stocks',
            data: { case: 'buy-stocks' }
          }),
          done);
    });

  it('should not buy stocks in case of insufficient stocks',
    (done) => {
      const corporation = game.findCorporation('america');
      corporation.active = true;
      corporation.stocksLeft = 2;
      game.buyStocksState();

      request(app)
        .post('/api/buy-stocks')
        .set('content-type', 'application/json')
        .send(JSON.stringify({
          stocks: [{
            corporationId: 'america',
            numOfStocks: 3
          }]
        }))
        .expect(422,
          JSON.stringify({
            message: 'Inactive corporation or Insufficient stocks',
            data: { case: 'buy-stocks' }
          }),
          done);
    });

  it('should not buy stocks when coroporation is inactive',
    (done) => {
      const corporation = game.findCorporation('america');
      corporation.stocksLeft = 2;
      game.buyStocksState();

      request(app)
        .post('/api/buy-stocks')
        .set('content-type', 'application/json')
        .send(JSON.stringify({
          stocks: [{
            corporationId: 'america',
            numOfStocks: 3
          }]
        }))
        .expect(422,
          JSON.stringify({
            message: 'Inactive corporation or Insufficient stocks',
            data: { case: 'buy-stocks' }
          }),
          done);
    });

  it('should not buy stocks when player doesn\'t have sufficient money',
    (done) => {
      const corporation = game.findCorporation('america');
      const player = game.getPlayer('user');
      corporation.stocksLeft = 12;
      player.money = 200;
      game.buyStocksState();

      request(app)
        .post('/api/buy-stocks')
        .set('content-type', 'application/json')
        .send(JSON.stringify({
          stocks: [{
            corporationId: 'america',
            numOfStocks: 3
          }]
        }))
        .expect(422,
          JSON.stringify({
            message: 'Insufficient money',
            data: { case: 'buy-stocks' }
          }),
          done);
    });
});

describe('POST /api/sell-stocks', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 1);
  games.add(game);
  game.addPlayer(new Player({ id: 'user', name: 'sam' }));
  const app = initApp(session('123', 'user'), games);

  before((done) => {
    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });

  beforeEach((done) => {
    const tile = game.board.tiles.find(tile => tile.id === '3a');
    game.currentPlayer.addTile(tile);
    game.currentPlayer.stocks = [{ corporationId: 'america', count: 2 }];

    const corporation1 = game.findCorporation('america');
    placeTiles(game, ['1a', '2a']);
    game.buildCorporation(corporation1.id, '1a', 'user');

    const corporation2 = game.findCorporation('zeta');
    placeTiles(game, ['4a', '5a', '6a']);
    game.buildCorporation(corporation2.id, '4a', 'user');

    const tileId = '3a';
    request(app)
      .post('/api/place-tile')
      .send(`id=${tileId}`)
      .expect('content-type', /json/)
      .expect(200, done);
  });

  it('should sell stocks of defunct corporation', (done) => {
    request(app)
      .post('/api/sell-stocks')
      .send('stockCount=2')
      .expect('content-type', /json/)
      .expect(200, done);
  });

});
