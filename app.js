const express = require('express');
const {
  getWelcomeMessage,
  getAllCategories,
  getReviewById,
  getReviewsSorted,
  getCommentsByReviewId,
  deleteComment,
  postCommentByReviewId,
  patchReviewVotes
} = require('./Controllers/nc_games_controllers');
const {
  handle404s,
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require('./Errors/errors');
const app = express();

app.use(express.json());

app.get('/api', getWelcomeMessage);
app.get(`/api/categories`, getAllCategories);
app.get(`/api/reviews/:review_id`, getReviewById);
app.get(`/api/reviews`, getReviewsSorted);
app.get(`/api/reviews/:review_id/comments`, getCommentsByReviewId);
app.delete(`/api/comments/:comment_id`, deleteComment);
app.post(`/api/reviews/:review_id/comments`, postCommentByReviewId);
app.patch(`api/review/:review_id`, patchReviewVotes);

// ERROR HANDLING
app.use(handle404s);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

app.listen(9090, () => {
  console.log('listening on 9090');
});

module.exports = app;
