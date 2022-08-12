const request = require('supertest');
const assert = require('assert');
const { createApp } = require('../../src/app.js');
const Sinon = require('sinon');
const { newGame } = require('../../src/models/game.js');
const { Games } = require('../../src/models/games.js');
const { Player } = require('../../src/models/player.js');

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
  dataStore.load.withArgs('LOGIN_TEMPLATE').returns('_MESSAGE_');
  dataStore.load.withArgs('SIGNUP_TEMPLATE').returns('_MESSAGE_');
  dataStore.load.withArgs('HOST_TEMPLATE_PATH').returns('_MESSAGE_');
  return createApp(config, dataStore);
};

describe('GET /api/loadgame', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  game.addPlayer(new Player('user', 'sam', game));
  const app = initApp(session('123', 'user'), games);

  it('should response with game data', (done) => {
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
  game.addPlayer(new Player('user', 'sam', game));
  game.addPlayer(new Player('user-2', 'harry', game));
  game.addPlayer(new Player('user-3', 'nilam', game));
  game.addPlayer(new Player('user-4', 'peter', game));
  const app = initApp(session('123', 'user'), games);

  it('should reorder the player, place tiles and start the game', (done) => {
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
        .send(`id=${tileId}`)
        .expect('content-type', /json/)
        .expect(200, done);
    });
});

describe('POST /api/place-tile', () => {
  const games = new Games();
  const host = { name: 'sam', id: 'user' };

  const game = newGame('123', host, 4);
  games.add(game);
  game.addPlayer(new Player('user', 'sam', game));
  game.addPlayer(new Player('user-2', 'harry', game));
  game.addPlayer(new Player('user-3', 'nilam', game));
  game.addPlayer(new Player('user-4', 'peter', game));
  const app = initApp(session('123', 'user'), games);

  before((done) => {
    request(app)
      .post('/api/start-game')
      .expect('content-type', /json/)
      .expect(200, done);
  });

  it('should remove tile from player\'s tiles and place it on board',
    (done) => {
      const player = game.players.find(player => player.id === 'user');
      const tileId = player.tiles[0].id;

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
    game.addPlayer(new Player('user', 'sam', game));
    game.addPlayer(new Player('user-2', 'harry', game));
    game.addPlayer(new Player('user-3', 'nilam', game));
    game.players.forEach(player => player.drawTile());
    game.reorder();

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
        const [drawLog] = games.find('123').logs.slice(-1);

        assert.deepStrictEqual(res.body.data, playerTile);
        assert.strictEqual(drawLog, currentPlayer.name + ' drew a tile');
        done();
      });
  });

  it('should not draw tile if player is not playing', (done) => {
    const app = initApp(session('123', 'user-23'), games);
    request(app)
      .post('/api/draw-tile')
      .expect('content-type', /json/)
      .expect(400, done);
  });
});
