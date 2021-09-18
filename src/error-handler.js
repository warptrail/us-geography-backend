const { NODE_ENV } = require('./config');
const logger = require('./logger');
const dayjs = require('dayjs');

function errorHandler(error, req, res, next) {
  let response;
  let timestamp = dayjs().format();

  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    logger.error(`${timestamp} >> ${error.message}`);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
}

module.exports = errorHandler;
