const { API_TOKEN } = require('./config');
const logger = require('./logger');
const dayjs = require('dayjs');

// ^ validation
const validateBearerToken = (req, res, next) => {
  const authToken = req.get('Authorization'); // the token from the client

  // compare the two tokens - if no match then return 401 unauthorized request response
  if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
    // log when authToken fails
    logger.error(
      `${dayjs().format()} -- Unauthorized request to path: ${req.path}`
    );
    return res.status(401).json({ error: 'Unauthorized Request' });
  }

  // move to the next middleware
  next();
};

module.exports = validateBearerToken;
