require('dotenv').config();
const { createApp } = require('./src/app.js');
const app = createApp();
const port = process.env.PORT || 8888;

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
