const request = require('supertest');
const { createApp } = require('../../src/app.js');
const Sinon = require('sinon');
const { newGame } = require('../../src/models/game.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');
const { createTiles } = require('../../src/utils/game.js');

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

describe('GET /game', () => {
  it('should serve game page if game started for logined player', (done) => {
    const games = new Games();
    const host = { name: 'sam', id: 'user' };

    const game = newGame('123', host, 4);
    games.add(game);
    game.addPlayer(new Player('user', 'sam'));

    const app = initApp(session('123', 'user'), games);
    game.start();

    request(app)
      .get('/game')
      .expect('content-type', /html/)
      .expect(200, done);
  });

  it('should redirect to login if player not logined', (done) => {
    const games = new Games();
    const host = { name: 'sam', id: 'user' };

    const game = newGame('123', host, 4);
    games.add(game);
    game.addPlayer(new Player('user', 'sam'));

    const app = initApp(session('123'), games);
    game.start();

    request(app)
      .get('/game')
      .expect('location', /^\/login/)
      .expect(302, done);
  });

  it('should respond with game not found for invalid game', (done) => {
    const games = new Games();
    const host = { name: 'sam', id: 'user' };

    const game = newGame('123', host, 4);
    games.add(game);
    game.addPlayer(new Player('user', 'sam'));

    const app = initApp(session('1233', 'user'), games);
    game.start();

    request(app)
      .get('/game')
      .expect('Game not found')
      .expect(404, done);
  });
});

describe('GET /lobby', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  game.addPlayer(new Player('user', 'sam'));

  const app = initApp(session('123', 'user'), games);
  it('should response with lobby page', (done) => {
    request(app)
      .get('/lobby/123')
      .expect(200)
      .expect('content-type', /^text\/html/, done);
  });
});

describe('GET /join', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  game.addPlayer(new Player('user', 'sam'));

  const app = initApp(session('123', 'user'), games);

  it('should redirect to lobby page if game found', (done) => {
    request(app)
      .get('/join/123')
      .expect(302)
      .expect('location', /lobby/, done);
  });

  it('should response with 404 if game not found', (done) => {
    request(app)
      .get('/join/125')
      .expect(404, done);
  });

  it('should redirect to login if session not found', (done) => {
    const session = () => (req, res, next) => {
      req.session = {};
      req.session.save = function (cb) {
        res.setHeader('set-cookie', 'connect.sid=23232');
        cb();
      };

      next();
    };

    const app = initApp(session);

    request(app)
      .get('/join/123')
      .expect(302)
      .expect('location', /login/, done);
  });

  it('should redirect to landing page if lobby is full', (done) => {
    const games = new Games();
    const host = { name: 'sam', id: 'user' };

    const game = newGame('123', host, 2);
    games.add(game);
    game.addPlayer(new Player('user', 'sam'));
    game.addPlayer(new Player('user-2', 'harry'));
    game.start();
    const app = initApp(session('123', 'user-3'), games);

    request(app)
      .get('/join/123')
      .expect(302)
      .expect('location', /^\/$/, done);
  });

  it('should redirect to game if game started and player exists', (done) => {
    const games = new Games();
    const host = { name: 'sam', id: 'user' };

    const game = newGame('123', host, 2);
    games.add(game);
    game.addPlayer(new Player({ id: 'user', name: 'sam' }));
    game.addPlayer(new Player({ id: 'user-2', name: 'harry' }));
    game.start();

    const app = initApp(session('123', 'user'), games);

    request(app)
      .get('/join/123')
      .expect(302)
      .expect('location', /^\/game$/, done);
  });
});

describe('GET /badPath', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  game.addPlayer(new Player({ id: 'user', name: 'sam' }));

  const app = initApp(session('123', 'user'), games);
  it('Should show not found page', (done) => {
    request(app)
      .get('/something-bad')
      .expect(404)
      .expect('content-type', /html/, done);
  });
});
