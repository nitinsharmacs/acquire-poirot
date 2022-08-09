const assert = require('assert');
const request = require('supertest');
const { createApp } = require('../../src/app.js');

describe('GET /api/loadgame', () => {
  const appConfig = {
    root: './public',
    cookieConfig: {
      sessionKey: 'hello'
    },
    resources: {
      loginTemplatePath: './resources/login.html',
      hostTemplatePath: './resources/host-page.html',
      signupTemplatePath: './resources/sign-up.html'
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
