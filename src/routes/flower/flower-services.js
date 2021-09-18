const logger = require('../../logger');
const USA_DATA = require('../../data/usa-data');
const dayjs = require('dayjs');
const removeDuplicates = require('../../helpers/removeDuplicates');

// ? Make an array of flower objects removing duplicates
const _generateFlowerArray = (data) => {
  const a_addFlowerId = data.map((state) => {
    const flowerObject = state.flower;
    flowerObject.id = state.flower.name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace("'", '');

    return flowerObject;
  });
  const b_removeDuplicateFlowers = removeDuplicates(a_addFlowerId);
  const returnArray = b_removeDuplicateFlowers;

  return returnArray;
};

const getFlowers = (req, res) => {
  const timestamp = dayjs().format();

  const flowerData = _generateFlowerArray(USA_DATA);
  if (!flowerData || flowerData.length === 0) {
    logger.error(`${timestamp} >> No flowers exist, data not found`);
    return res.status(400).send('No flowers exist, data not found');
  }
  return res.json(flowerData);
};

const getFlower = (req, res) => {
  const flowerParam = req.params.flower;
  const flowerData = _generateFlowerArray(USA_DATA);

  const flowerObject = flowerData.find((flower) => flower.id === flowerParam);

  if (!flowerObject) {
    logger.error(
      `${timestamp} >> ${flowerParam} is not a flower in the database`
    );
    return res.status(400).json({ error: 'Flower Not Found' });
  }

  return res.json(flowerObject);
};

module.exports = {
  getFlowers,
  getFlower,
};
