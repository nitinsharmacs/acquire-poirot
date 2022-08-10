const request = require('supertest');
const { createApp } = require('../../src/app.js');
const Sinon = require('sinon');
const { newGame } = require('../../src/models/game.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');

const session = () => (req, res, next) => {
  req.session = {};
  req.session.playerId = 'user';
  req.session.gameId = '123';
  req.session.save = function (cb) {
    res.setHeader('set-cookie', 'connect.sid=23232');
    cb();
  };

  next();
};

const initApp = (session) => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  game.addPlayer(new Player('user', 'sam', game));
  game.addPlayer(new Player('user-2', 'harry', game));
  game.addPlayer(new Player('user-3', 'nilam', game));
  game.addPlayer(new Player('user-4', 'peter', game));

  const config = { session, root: './public', games };
  const dataStore = {
    load: Sinon.stub(),
    loadJSON: Sinon.stub()
  };
  dataStore.load.withArgs('LOGIN_TEMPLATE').returns('_MESSAGE_');
  dataStore.load.withArgs('SIGNUP_TEMPLATE').returns('_MESSAGE_');
  dataStore.load.withArgs('HOST_TEMPLATE_PATH').returns('_MESSAGE_');
  return createApp(config, dataStore);
};

describe('GET /lobby', () => {
  const app = initApp(session);
  it('should response with lobby page', (done) => {
    request(app)
      .get('/lobby/123')
      .expect(200)
      .expect('content-type', /^text\/html/, done);
  });
});

describe('GET /join', () => {
  const app = initApp(session);
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
});
