const express = require('express');

const {
  getReviewsSorted,
  postNewReview,
  deleteReview,
  patchReviewVotes,
  getReviewById,
} = require('../Controllers/reviews.controller');

const {
  postCommentByReviewId,
  getCommentsByReviewId,
} = require('../Controllers/comments.controller');

const reviewsRouter = express.router();

reviewsRouter.route('/').get(getReviewsSorted).post(postNewReview);
reviewsRouter.route('/:review_id').get(getReviewById).patch(patchReviewVotes).delete(deleteReview);
reviewsRouter.route('/:review_id/comments').get(getCommentsByReviewId).post(postCommentByReviewId);

module.exports = reviewsRouter;
