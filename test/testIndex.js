const request = require('supertest');
const { createApp } = require('../src/app.js');

const fs = require('fs');

const loginTemplatePath = 'resources/login.html';
const hostPage = fs.readFileSync('resources/host-page.html', 'utf8');

const config = {
  root: './public',
  cookieConfig: {
    'COOKIE_NAME': 'sessionId',
    'COOKIE_KEY': 'hello'
  },
  resources: { loginTemplatePath },
  templates: { hostPage }
};

describe('GET /', () => {
  it('should show landing page', (done) => {
    request(createApp(config, fs))
      .get('/')
      .expect('Content-type', /html/)
      .expect(200, done);
  });
});

describe('GET /create-game', () => {
  it('should redirect to login page if session not present', (done) => {
    request(createApp(config, fs))
      .get('/create-game')
      .expect('location', '/login')
      .expect(302, done);
  });
});
