const { createApp } = require('./src/app.js');
const fs = require('fs');
require('dotenv').config();

const cookieName = process.env.COOKIE_NAME;
const sessionKey = process.env.SESSION_KEY;
const loginTemplatePath = process.env.LOGIN_TEMPLATE;

const config = {
  root: './public',
  cookieConfig: { cookieName, sessionKey },
  resources: { loginTemplatePath }
};

const app = createApp(config, fs);

app.listen(8888, () => console.log('Listening on http://localhost:8888'));
