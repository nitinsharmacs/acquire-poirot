const assert = require('assert');
const request = require('supertest');
const { createApp } = require('../../src/app.js');

const config = {
  root: './public',
  cookieConfig: {
    sessionKey: 'hello'
  },
  resources: {
    loginTemplatePath: './login',
    hostTemplatePath: './host', signupTemplatePath: './signup'
  },
};

const mockReadFileSync = (expected, expectedEncoding) => {
  let index = 0;
  return (fileName, encoding) => {
    const { content, file } = expected[index];
    assert.strictEqual(fileName, file);
    assert.strictEqual(encoding, expectedEncoding);
    index++;
    return content;
  };
};

describe('GET /api/loadgame', () => {
  const fs = {
    readFileSync: mockReadFileSync([
      { file: './login', content: 'Login page with _MESSAGE_' },
      { file: './signup', content: 'Signup page with _MESSAGE_' },
      { file: './host', content: 'hello' },
    ], 'utf8')
  };

  const app = createApp(config, fs);
  it('should response with game data', (done) => {
    request(app)
      .get('/api/loadgame/12')
      .expect(200)
      .expect('content-type', /^application\/json/, done);
  });
});
