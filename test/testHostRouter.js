const request = require('supertest');
const { createApp } = require('../src/app.js');

const Sinon = require('sinon');
const { Games } = require('../src/models/games.js');
const { newGame } = require('../src/models/game.js');
const { Player } = require('../src/models/player.js');

const session = () => (req, res, next) => {
  req.session = {};
  req.session.save = function (cb) {
    res.setHeader('set-cookie', 'connect.sid=23232');
    cb();
  };

  next();
};

const initApp = (session) => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('1123', host, 3);
  games.add(game);

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

describe('GET /host', () => {
  it('should redirect to login page if session not present', (done) => {
    request(initApp(session))
      .get('/host')
      .expect('location', '/login?ref=host')
      .expect(302, done);
  });
});

describe('GET /host', () => {
  const session = () => (req, res, next) => {
    req.session = {};
    req.session.playerId = '1123';
    req.session.save = function (cb) {
      res.setHeader('set-cookie', 'connect.sid=23232');
      cb();
    };

    next();
  };

  it('should give host page is session present', (done) => {
    request(initApp(session))
      .get('/host')
      .expect('content-type', /html/)
      .expect(200, done);
  });
});

describe('POST /host', () => {
  it('should redirect to login page if session not present', (done) => {
    request(initApp(session))
      .post('/host')
      .expect('location', '/login?ref=host')
      .expect(302, done);
  });
});

describe('POST /host', () => {
  const session = () => (req, res, next) => {
    req.session = {};
    req.session.playerId = '1123';
    req.session.save = function (cb) {
      res.setHeader('set-cookie', 'connect.sid=23232');
      cb();
    };

    next();
  };

  let app;
  beforeEach(() => {
    app = initApp(session);
  });

  it('should show lobby when host enter no of players and host a game',
    (done) => {
      request(app)
        .post('/host')
        .send('noOfPlayers=4')
        .expect('location', /^\/lobby*/)
        .expect(302, done);
    });

  it('should show error in host page when host did not enter no of players and host a game', (done) => {
    request(app)
      .post('/host')
      .send('host=localhost')
      .expect('content-type', /html/)
      .expect(/Please enter valid number of players/)
      .expect(200, done);
  });
});
