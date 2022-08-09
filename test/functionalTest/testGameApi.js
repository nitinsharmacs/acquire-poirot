const request = require('supertest');
const { createApp } = require('../../src/app.js');
const Sinon = require('sinon');
const { newGame } = require('../../src/models/game.js');
const { Games } = require('../../src/models/games.js');

const session = () => (req, res, next) => {
  req.session = {};
  req.session.playerId = '1123';
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

  const game = newGame('123', host, 3);
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

describe.only('GET /api/loadgame', () => {
  const app = initApp(session);
  it('should response with game data', (done) => {
    request(app)
      .get('/api/loadgame')
      .expect(200)
      .expect('content-type', /^application\/json/, done);
  });
});
