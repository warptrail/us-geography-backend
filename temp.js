// ^ helper functions
const removeDuplicates = require('./removeDuplicates');

// ^ import the database:
const unitedStatesData = require('./StateData');

// ^ validation middleware
const validateBearerToken = (req, res, next) => {
  const authToken = req.get('Authorization'); // the token from the client
  const apiToken = process.env.API_TOKEN; // the token stored in the .env file

  // compare the two tokens - if no match then return 401 unauthorized request response
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized Request' });
  }

  // move to the next middleware
  next();
};

// ^ use middleware
app.use(validateBearerToken);

// ^ greeting message
app.get('/', (req, res) => res.send('hello, usa'));

// ^ get all states data, narrow by search, sort by name or date founded
app.get('/states', (req, res) => {
  // ? search query
  const { search = '', sort } = req.query;

  // ? validate the sort, it can only be 'name' or 'founded'
  if (sort) {
    if (!['name', 'founded'].includes(sort)) {
      return res.status(400).send('Sort must be one of name or founded');
    }
  }

  // ? narrow search
  const searchResults = unitedStatesData.filter((state) =>
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
});

// ^ get a list of all state names
const getStateNames = (req, res) => {
  const { sort } = req.query;

  if (sort) {
    if (!['name', 'founded'].includes(sort)) {
      return res.status(400).send('Sort query must be one of name or founded');
    }
  }

  if (!sort || sort === 'name') {
    const stateNames = unitedStatesData.map((state) => {
      const stateObj = { name: state.name, founded: state.founded };
      return stateObj;
    });
    res.status(200).json(stateNames);
  } else if (sort === 'founded') {
    const stateNamesSortByFounded = unitedStatesData.map((state) => {
      const stateObj = { name: state.name, founded: state.founded };
      return stateObj;
    });

    const sortStates = stateNamesSortByFounded.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });

    // sortStates = sortStates.map((state) => state.name);
    return res.status(200).json(sortStates);
  }
};

app.get('/state-names', getStateNames);

// ^ Get an individual state

app.get('/state', (req, res) => {
  return res.json({
    message:
      'enter a forward slash followed by the state name with no spaces to get more information about the state you are looking for',
    example: 'http://localhost:8080/state/colorado',
  });
});

const getState = (req, res) => {
  const stateParam = req.params.state;

  const nameArray = unitedStatesData.map((state, i) => {
    return state.name.toLowerCase().replace(/\s+/g, '');
  });

  // add admitted to union data based off of founded value
  const changeDataA = () => {
    const sortedStates = unitedStatesData.sort((a, b) =>
      a.founded > b.founded ? 1 : a.founded < b.founded ? -1 : 0
    );

    const addAdmittedValue = sortedStates.map((state, i) => {
      const updateStateObj = { ...state, admitted: i };
      return updateStateObj;
    });
  };

  const modifiedUsDataA = unitedStatesData.map((state, i) => {
    const addId = { ...state, id: nameArray[i] };
    return addId;
  });

  const modifiedUsDataB = modifiedUsDataA.sort((a, b) =>
    a.founded > b.founded ? 1 : a.founded < b.founded ? -1 : 0
  );

  const modifiedUsDataC = modifiedUsDataB.map((s, i) => {
    const o = { ...s, admitted: i + 1 };
    return o;
  });

  if (!nameArray.includes(stateParam.toLowerCase())) {
    return res.status(400).json({ error: 'cannot find state', code: '304s' });
  }

  const stateResponse = modifiedUsDataC.find((s) => s.id === stateParam);
  Object.assign(stateResponse.flower, { id: 'flower' });
  Object.assign(stateResponse.tree, { id: 'tree' });
  Object.assign(stateResponse.mineral, { id: 'mineral' });
  Object.assign(stateResponse.fossil, { id: 'fossil' });

  res.json(stateResponse);
};
app.get('/state/:state', getState);

// ^ Get flowers

// ? Make an array of flower objects removing duplicates
const generateFlowerArray = (data) => {
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
  const flowerData = generateFlowerArray(unitedStatesData);
  return res.json(flowerData);
};

const getFlower = (req, res) => {
  const flowerParam = req.params.flower;
  const flowerData = generateFlowerArray(unitedStatesData);

  const flowerObject = flowerData.find((flower) => flower.id === flowerParam);

  if (!flowerObject) {
    return res.status(400).json({ error: 'no flower' });
  }

  return res.json(flowerObject);
};
app.get(['/flowers', '/flower'], getFlowers);
app.get('/flower/:flower', getFlower);

app.get('/download', (req, res) => {
  const file = `${__dirname}/rw.vcf`;
  res.download(file);
});

// ! Launch the Server
app.listen(8080, () => {
  console.log('Server running on PORT 8080');
});
