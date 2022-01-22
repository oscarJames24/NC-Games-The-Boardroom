const express = require('express');
const fs = require('fs/promises')
const {
  getAllCategories,
  getReviewById,
  getReviewsSorted,
  getCommentsByReviewId,
  deleteComment,
  postCommentByReviewId,
  patchReviewVotes,
  getAllEndPoints,
  getAllUsers,
  getUserDataByUsername,
  patchCommentVotes,
  postNewReview,
  postNewCategory,
  deleteReview
} = require('./Controllers/nc_games_controllers');
const {
  handle404s,
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require('./Errors/errors');
const app = express();

app.use(express.json());

app.get('/api', getAllEndPoints);
app.get(`/api/categories`, getAllCategories);
app.get(`/api/reviews/:review_id`, getReviewById);
app.get(`/api/reviews`, getReviewsSorted);
app.get(`/api/reviews/:review_id/comments`, getCommentsByReviewId);
app.delete(`/api/comments/:comment_id`, deleteComment);
app.post(`/api/reviews/:review_id/comments`, postCommentByReviewId);
app.patch(`/api/review/:review_id`, patchReviewVotes);
app.get('/api/users', getAllUsers);
app.get('/api/users/:username', getUserDataByUsername);
app.patch(`/api/comments/:comment_id`, patchCommentVotes);
app.post(`/api/reviews`, postNewReview);
app.post(`/api/categories`, postNewCategory);
app.delete(`/api/reviews/:review_id`, deleteReview)

// ERROR HANDLING
app.use(handle404s);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
