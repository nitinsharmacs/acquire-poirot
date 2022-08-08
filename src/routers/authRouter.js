const express = require('express');

const serveLoginPage = loginTemplate => (request, response) => {
  response.type('text/html');
  response.end(loginTemplate);
};

const createAuthRouter = ({ loginTemplatePath }, fs) => {
  const loginTemplate = fs.readFileSync(loginTemplatePath, 'utf8');
  const router = express.Router();
  router.get('/login', serveLoginPage(loginTemplate));
  return router;
};

module.exports = { createAuthRouter };
