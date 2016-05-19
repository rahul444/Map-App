# Map-App
Simple venue searching and commenting app built using node.js and react.js

## Usage:
1. Enter a location to search either by zipcode or city name
2. Click on a venue to learn more about the venue and view comments
3. Comment on a venue by entering your name and a comment

## Running Locally:
1. Clone the repo to your computer
2. Run the command `npm install`
3. Since, the app uses mysql for the db, make sure you have mysql installed
4. Create two tables using mysql as specified in schema.sql and server.js (lines 11 - 15)
5. Run the command `node server.js`
6. Go to `localhost:8000` on your browser
