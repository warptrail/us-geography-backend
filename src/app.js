require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const { NODE_ENV } = require('./config');
const dayjs = require('dayjs');

// ^ establish the Express server
const app = express();

// ^ determine morgan logging dependent on node environment mode
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

// ^ set up winston
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'info.log' })],
});

if (NODE_ENV !== 'production') {
  winstonLogger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
}

// ^ middleware
app.use(morgan(morganOption)); // logging requests in the console
app.use(cors()); // allows cross origin requests
app.use(helmet()); // provides some security to headers

// ^ validation
const validateBearerToken = (req, res, next) => {
  const authToken = req.get('Authorization'); // the token from the client
  const apiToken = process.env.API_TOKEN; // the token stored in the .env file

  // compare the two tokens - if no match then return 401 unauthorized request response
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    // log when authToken fails
    winstonLogger.error(
      `${dayjs().format()} -- Unauthorized request to path: ${req.path}`
    );
    return res.status(401).json({ error: 'Unauthorized Request' });
  }

  // move to the next middleware
  next();
};

app.use(validateBearerToken);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
