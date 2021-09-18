const app = require('./app');
const { PORT, NODE_ENV } = require('./config');

const portOption = NODE_ENV === 'production' ? false : true;

app.listen(PORT, () => {
  if (portOption) {
    console.log(`Server listening at http://localhost:${PORT}`);
  }
});
