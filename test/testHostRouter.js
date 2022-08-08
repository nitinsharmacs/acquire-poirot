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
    sessionKey: 'abcd'
  },
  resources: {
    loginTemplatePath: './login',
    signupTemplatePath: './signup',
    hostTemplatePath: './host'
  },
};

describe('GET /host', () => {
  it('should redirect to login page if session not present', (done) => {
    const fs = {
      readFileSync: mockReadFileSync([
        { file: './login', content: 'Login page with _MESSAGE_' },
        { file: './signup', content: 'Signup page with _MESSAGE_' },
        { file: './host', content: 'hello' }], 'utf8')
    };
    request(createApp(config, fs))
      .get('/host')
      .expect('location', '/login?ref=host')
      .expect(302, done);
  });
});

describe('POST /host', () => {
  it('should redirect to login page if session not present', (done) => {
    const fs = {
      readFileSync: mockReadFileSync([
        { file: './login', content: 'Login page with _MESSAGE_' },
        { file: './signup', content: 'Signup page with _MESSAGE_' },
        { file: './host', content: 'hello' }], 'utf8')
    };
    request(createApp(config, fs))
      .post('/host')
      .expect('location', '/login?ref=host')
      .expect(302, done);
  });
});

