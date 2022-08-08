const { createApp } = require('./src/app.js');
const fs = require('fs');
require('dotenv').config();

const sessionKey = process.env.SESSION_KEY;
const loginTemplatePath = process.env.LOGIN_TEMPLATE;
const hostTemplatePath = process.env.HOST_TEMPLATE_PATH;

const config = {
  root: './public',
  cookieConfig: { sessionKey },
  resources: { loginTemplatePath, hostTemplatePath }
};

const app = createApp(config, fs);

app.listen(8888, () => console.log('Listening on http://localhost:8888'));
