const request = require('supertest');
const assert = require('assert');
const { createApp } = require('../src/app.js');

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

describe('GET /login', () => {
  const appConfig = {
    root: './public',
    cookieConfig: { sessionKey: 'abc' },
    resources: { loginTemplatePath: './login' }
  };

  it('should serve login page', (done) => {

    const fs = {
      readFileSync: mockReadFileSync([
        { file: './login', content: 'Login page with _MESSAGE_' }], 'utf8')
    };

    const req = request(createApp(appConfig, fs));
    req.get('/login')
      .expect('content-type', /html/)
      .expect(200, done);
  });
});

describe('GET /login', () => {
  const appConfig = {
    root: './public',
    cookieConfig: { sessionKey: 'abc' },
    resources: { loginTemplatePath: './login' }
  };

  it('should serve login page with apt error message 404(invalid credentials)', (done) => {

    const fs = {
      readFileSync: mockReadFileSync([
        { file: './login', content: 'Login page with _MESSAGE_' }], 'utf8')
    };

    const req = request(createApp(appConfig, fs));
    req.get('/login')
      .set('Cookie', 'errCode=404')
      .expect('content-type', /html/)
      .expect(200, 'Login page with Invalid username or password', done);
  });
});

describe('GET /login', () => {
  const appConfig = {
    root: './public',
    cookieConfig: { sessionKey: 'abc' },
    resources: { loginTemplatePath: './login' }
  };

  it('should serve login page with apt error message 401(fields cannot be empty)', (done) => {

    const fs = {
      readFileSync: mockReadFileSync([
        { file: './login', content: 'Login page with _MESSAGE_' }], 'utf8')
    };

    const req = request(createApp(appConfig, fs));
    req.get('/login')
      .set('Cookie', 'errCode=401')
      .expect('content-type', /html/)
      .expect(200, 'Login page with Fields cannot be empty', done);
  });
});
