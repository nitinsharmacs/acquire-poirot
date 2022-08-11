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

describe('GET /api/loadgame', () => {
  const app = initApp(session);
  it('should response with game data', (done) => {
    request(app)
      .get('/api/loadgame')
      .expect(200)
      .expect('content-type', /^application\/json/, done);
  });
});

describe('POST /api/start-game', () => {
  const app = initApp(session);
  it('should reorder the player, place tiles and start the game', (done) => {
    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });
});

describe('POST /api/place-tile', () => {
  const app = initApp(session);
  before((done) => {
    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });

  it('should remove tile from player\'s tiles and place it on board',
    (done) => {
      const game = app.games.find('123');
      const player = game.players.find(player => player.id === 'user');
      const tileId = player.tiles[0].id;

      request(app)
        .post('/api/place-tile')
        .send(`tileId=${tileId}`)
        .expect('content-type', /json/)
        .expect(200, done);
    });
});
