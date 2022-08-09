const { createApp } = require('./src/app.js');
require('dotenv').config();

const sessionKey = process.env.SESSION_KEY;
const loginTemplatePath = process.env.LOGIN_TEMPLATE;
const signupTemplatePath = process.env.SIGNUP_TEMPLATE;
const hostTemplatePath = process.env.HOST_TEMPLATE_PATH;
const usersdbPath = process.env.USERS_DB_PATH;

const config = {
  root: './public',
  cookieConfig: { sessionKey },
  resources: { loginTemplatePath, hostTemplatePath, signupTemplatePath },
  db: { usersdbPath }
};

const app = createApp(config);

app.listen(8888, () => console.log('Listening on http://localhost:8888'));
