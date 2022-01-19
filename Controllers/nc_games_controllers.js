const {
  fetchAllCategories,
  fetchReviewById,
  selectReviews,
  fetchCommentsByReviewId,
  removeCommentById,
  insertCommentByReviewId,
  updateReviewVotes,
  fetchAllEndPoints
} = require('../Models/nc_games_models');
const endpoints = require('./endpoints.json')

exports.fetchAllEndPoints = (req, res) => {
  res.send(endpoints)
}

exports.getWelcomeMessage = (req, res) => {
  res.status(200).send({ message: 'all ok' });
};

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  fetchReviewById(req.params.review_id)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
        console.log(err, 'err in controller')
      next(err);
    });
};

exports.getReviewsSorted = (req, res, next) => {

  const { sort_by, order, category } = req.query;
  console.log(req.query, 'req query in controller')
  selectReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
        console.log(err, 'err in the catch')
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  fetchCommentsByReviewId(req.params.review_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send('');
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (req, res, next) => {
  const review_id = req.params.review_id;
  const newComment = req.body;
  insertCommentByReviewId(review_id, newComment)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewVotes = (req, res, next) => {
    const { review_id } = req.params;
    console.log(req.body, 'req body')
    updateReviewVotes(review_id, req.body)
    .then((updatedReview => {
        console.log(updatedReview, 'back in controller')
        res.status(200).send({ review: updatedReview})
    }))
}
