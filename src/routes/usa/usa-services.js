const logger = require('../../logger');
const USA_DATA = require('../../data/usa-data');
const dayjs = require('dayjs');

module.exports = {
  getAllStates: (req, res) => {
    // ? generate timestamp of request
    const timestamp = dayjs().format();

    // ? search query
    const { search = '', sort } = req.query;

    // ? validate the sort, it can only be 'name' or 'founded'
    if (sort) {
      if (!['name', 'founded'].includes(sort)) {
        logger.error(
          `${timestamp} >> ${sort} is an invalid query - must be one of "name" or "founded"`
        );
        return res.status(400).send('Sort must be one of name or founded');
      }
    }

    // ? narrow search
    const searchResults = USA_DATA.filter((state) =>
      state.name.toLowerCase().includes(search.toLowerCase())
    );

    // ? if sort exists and is validated, sort the search results
    if (sort) {
      searchResults.sort((a, b) =>
        a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
      );
    }

    // ? final result
    res.status(200).json(searchResults);
  },
  getStateNames: (req, res) => {
    const { sort } = req.query;

    if (sort) {
      if (!['name', 'founded'].includes(sort)) {
        return res
          .status(400)
          .send('Sort query must be one of name or founded');
      }
    }

    if (!sort || sort === 'name') {
      const stateNames = USA_DATA.map((state) => {
        const stateObj = { name: state.name, founded: state.founded };
        return stateObj;
      });
      res.status(200).json(stateNames);
    } else if (sort === 'founded') {
      const stateNamesSortByFounded = USA_DATA.map((state) => {
        const stateObj = { name: state.name, founded: state.founded };
        return stateObj;
      });

      const sortStates = stateNamesSortByFounded.sort((a, b) => {
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
      });

      // sortStates = sortStates.map((state) => state.name);
      return res.status(200).json(sortStates);
    }
  },
  getStateDemo: (req, res) => {
    return res.json({
      message:
        'enter a forward slash followed by the state name with no spaces to get more information about the state you are looking for',
      example: 'http://localhost:8080/state/colorado',
    });
  },
  getState: (req, res) => {
    const stateParam = req.params.stateParam;

    // make an array of each state name to lowercase and remove spaces
    const nameArray = USA_DATA.map((state, i) => {
      return state.name.toLowerCase().replace(/\s+/g, '');
    });

    // create new object for each state and add each corresponding
    // index to the object as an id
    const modifiedUsDataA = USA_DATA.map((state, i) => {
      const addId = { ...state, id: nameArray[i] };
      return addId;
    });

    // sort each state by when it was founded
    const modifiedUsDataB = modifiedUsDataA.sort((a, b) =>
      a.founded > b.founded ? 1 : a.founded < b.founded ? -1 : 0
    );

    // with the previous sorted array, set the admitted property
    // as its own index + 1
    const modifiedUsDataC = modifiedUsDataB.map((s, i) => {
      const o = { ...s, admitted: i + 1 };
      return o;
    });

    // if incorrect state is entered in parameter then throw an error
    if (!nameArray.includes(stateParam.toLowerCase())) {
      return res.status(400).json({ error: 'cannot find state' });
    }

    // find the state that matches the parameter
    const stateResponse = modifiedUsDataC.find((s) => s.id === stateParam);
    // tag on state symbol ids
    // todo fix this to use the property name as a value on the front end
    Object.assign(stateResponse.flower, { id: 'flower' });
    Object.assign(stateResponse.tree, { id: 'tree' });
    Object.assign(stateResponse.mineral, { id: 'mineral' });
    Object.assign(stateResponse.fossil, { id: 'fossil' });

    res.json(stateResponse);
  },
};
