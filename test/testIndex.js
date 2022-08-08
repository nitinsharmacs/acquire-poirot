const request = require('supertest');
const { createApp } = require('../src/app.js');
const assert = require('assert');

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

const config = {
  root: './public',
  cookieConfig: {
    sessionKey: 'hello'
  },
  resources: {
    loginTemplatePath: './login',
    hostTemplatePath: './host',
    signupTemplatePath: './signup'
  },
};

describe('GET /', () => {
  it('should show landing page', (done) => {

    const fs = {
      readFileSync: mockReadFileSync([
        { file: './login', content: 'Login page with _MESSAGE_' },
        { file: './signup', content: 'Signup page with _MESSAGE_' },
        { file: './host', content: 'hello' }], 'utf8')
    };
    request(createApp(config, fs))
      .get('/')
      .expect('Content-type', /html/)
      .expect(200, done);
  });
});
