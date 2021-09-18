const express = require('express');
const {
  getAllStates,
  getStateNames,
  getStateDemo,
  getState,
} = require('./usa-services');

const usaRouter = express.Router();

usaRouter.route('/states').get(getAllStates);
usaRouter.route('/state-names').get(getStateNames);
usaRouter.route('/state').get(getStateDemo);
usaRouter.route('/state/:stateParam').get(getState);

module.exports = usaRouter;
