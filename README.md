# Setup Express API from scratch:

`npm install express cors morgan`
`npm install -D nodemon`

# Update scripts in package.json -->

`"start": "node index.js", "dev": "nodemon app"`

# Git initialization

`git init`
`touch .gitignore`
`echo "node_modules" > .gitignore`

# env variables

`touch .env` --> Make new hidden env file
`echo ".env" >> .gitignore` --> add the .env file to the .gitignore list

- store the API token in your env file:
  `API_TOKEN=put-your-token-here`

- install dotenv
  `npm install dotenv`

# testing

`npm install mocha chai supertest -D`

- Modify package.json env to include mocha and chai for eslint and include the test script

# Winston

`npm install winston`

- For logging purposes

# Access local server at:

`http://localhost:8080/`

# Endpoints:

`GET '/' `--> Greeting message

`GET '/states'` --> list of all 50 state objects with all data

- Accepted queries: "search" - "sort"
- Search will narrow the states down to the matching strings
- Sort must be either "name" or "founded". Will return the states in alphabetical order or chronological order respectively.

`GET '/state-names'` --> get a list of states with only name and founded information

`GET '/state/:stateName'` --> get a specific state object with all information

`GET /flowers` --> get a list of all the flower objects in the data file

`GET /flower/:flowerName` --> get a specific flower

`GET '/download'` --> endpoint to download my contact vcf file
