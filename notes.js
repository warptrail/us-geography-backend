const { unitedStates } = require('./StateData');

const sortStatesByFoundedDate = unitedStates.sort((a, b) =>
  a.founded < b.founded ? -1 : a.founded > b.founded ? 1 : 0
);

console.log('hello');
