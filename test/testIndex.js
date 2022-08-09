const request = require('supertest');
const { createApp } = require('../src/app.js');

describe('GET /', () => {
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

  it('should show landing page', (done) => {
    request(createApp(appConfig))
      .get('/')
      .expect('Content-type', /html/)
      .expect(200, done);
  });
});
