const express = require('express');
const { getWelcomeMessage, getAllCategories, getReviewById } = require('./Controllers/nc_games_controllers');
const { handle404s } = require('./Errors/errors')
const app = express();

app.use(express.json());

app.get('/api', getWelcomeMessage);

app.get(`/api/categories`, getAllCategories);

app.get(`/api/reviews/:review_id`, getReviewById);

// ERROR HANDLING
app.use(handle404s);


app.listen(9090, () => {
  console.log('listening on 9090');
});

module.exports = app;
