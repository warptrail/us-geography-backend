/* eslint-disable prefer-destructuring */
/* eslint-disable brace-style */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
function removeDuplicates(arr) {
  const result = [];
  const map = {};

  for (let i = 0; i < arr.length; i++) {
    const id = arr[i].id;
    if (map[id]) {
      continue;
    } else {
      result.push(arr[i]);
      map[arr[i].id] = true;
    }
  }

  return result;
}

module.exports = removeDuplicates;
