const assert = require('assert');
const request = require('supertest');
const { createApp } = require('../../src/app.js');

const session = () => (req, res, next) => {
  req.session = {};
  req.session.playerId = '1123';
  req.session.save = function (cb) {
    res.setHeader('set-cookie', 'connect.sid=23232');
    cb();
  };

  next();
};

describe('GET /api/loadgame', () => {
  const appConfig = {
    root: './public',
    session,
    cookieConfig: {
      sessionKey: 'hello'
    },
    resources: {
      loginTemplatePath: './resources/login.html',
      hostTemplatePath: './resources/host-page.html',
      signupTemplatePath: './resources/sign-up.html',
      gameTemplatePath: './resources/game.html'
    },
    db: { usersdbPath: './test/testData/users.json' }
  };

  const app = createApp(appConfig);
  it('should response with game data', (done) => {
    request(app)
      .get('/api/loadgame/12')
      .expect(200)
      .expect('content-type', /^application\/json/, done);
  });
});
