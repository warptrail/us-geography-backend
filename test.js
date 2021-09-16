/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
function removeDuplicates(arr) {
  const result = [];
  const map = {};

  for (let i = 0; i < arr.length; i++) {
    const name = arr[i].name;
    console.log(name);
    if (map[name]) {
      // console.log(map[arr[i]]);
      console.log('continue');
      continue;
    } else {
      console.log(map[arr[i]]);
      result.push(arr[i]);
      map[arr[i].name] = true;
      console.log(map);
    }
  }

  return result;
}

const stuff = [
  { name: 'tree' },
  { name: 'brush' },
  { name: 'shrub' },
  { name: 'tree' },
  { name: 'brush' },
  { name: 'tree' },
];

console.log(removeDuplicates(stuff));
