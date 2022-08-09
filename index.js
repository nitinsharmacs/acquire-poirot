require('dotenv').config();
const { createApp } = require('./src/app.js');
const app = createApp();

app.listen(8888, () => console.log('Listening on http://localhost:8888'));
