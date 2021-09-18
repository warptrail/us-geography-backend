const unitedStates = [
  { founded: '12-14' },
  { founded: '12-14' },
  { founded: '12-10' },
  { founded: '09-90' },
  { founded: '09-13' },
];

const sortStatesByFoundedDate = unitedStates.sort((a, b) =>
  a.founded < b.founded ? -1 : a.founded > b.founded ? 1 : 0
);

console.log(unitedStates);
