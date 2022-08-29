const request = require('supertest');
const { createApp } = require('../../src/app.js');

const { Games } = require('../../src/models/games.js');
const { newGame } = require('../../src/models/game.js');

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
  return createApp(config);
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
  beforeEach((done) => {
    app = initApp(session);
    done();
  });

  it('should show lobby when host enter no of players and host a game',
    (done) => {
      request(app)
        .post('/host')
        .send('noOfPlayers=4')
        .expect('location', /^\/lobby*/)
        .expect(302, done);
    });

  it('should show error for invalid number of players', (done) => {
    request(app)
      .post('/host')
      .send('host=localhost')
      .expect('content-type', /html/)
      .expect(/Please enter valid number of players/)
      .expect(200, done);
  });
});
