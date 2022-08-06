const { createApp } = require('./src/app.js');

const config = { root: './public' };
const app = createApp(config);

app.listen(8888, () => console.log('Listening on http://localhost:8888'));
