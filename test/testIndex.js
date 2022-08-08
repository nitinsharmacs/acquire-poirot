const request = require('supertest');
const { createApp } = require('../src/app.js');

const config = { root: './public' };

describe('GET /', () => {
  it('should show landing page', (done) => {
    request(createApp(config))
      .get('/')
      .expect('Content-type', /html/)
      .expect(200, done);
  });
});
