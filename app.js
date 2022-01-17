const express = require('express');
const { getWelcomeMessage, getAllCategories } = require('./Controllers/nc_games_controllers');
const app = express();

app.use(express.json());

app.get('/api', getWelcomeMessage);

app.get(`/api/categories`, getAllCategories);

app.listen(9090, () => {
  console.log('listening on 9090');
});

module.exports = app;
