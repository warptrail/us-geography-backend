const express = require('express');

const flowerRouter = express.Router();
const { getFlowers, getFlower } = require('./flower-services');

flowerRouter.get(['/flowers', '/flower'], getFlowers);
flowerRouter.get('/flower/:flower', getFlower);

module.exports = flowerRouter;
