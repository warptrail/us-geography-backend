require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const validateBearerToken = require('./validate-bearer-token');
const errorHandler = require('./error-handler');
const usaRouter = require('./routes/usa/usa-router');
const flowerRouter = require('./routes/flower/flower-router');

// ^ establish the Express server
const app = express();

// ^ determine morgan logging dependent on node environment mode
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

// ^ middleware
app.use(morgan(morganOption)); // logging requests in the console
app.use(cors()); // allows cross origin requests
app.use(helmet()); // provides some security to headers

app.get('/download', (req, res) => {
  const file = `${__dirname}/download/rw.vcf`;
  res.download(file);
});

app.get('/download/resume', (req, res) => {
  const file = `${__dirname}/download/whitmore_ryan_resume.pdf`;
  res.download(file);
});

app.use(validateBearerToken);

app.get('/', (req, res) => {
  res.json({ status: true });
});

app.use(usaRouter);
app.use(flowerRouter);

// ^ error handler
app.use(errorHandler);

module.exports = app;
