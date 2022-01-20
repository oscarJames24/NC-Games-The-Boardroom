const {
  fetchAllCategories,
  fetchReviewById,
  selectReviews,
  fetchCommentsByReviewId,
  removeCommentById,
  insertCommentByReviewId,
  updateReviewVotes,
  fetchAllUsers,
  fetchUserDataByUsername,
  updatedCommentVotes,
  addNewReview,
  addNewCategory,
  deleteReviewById,
} = require('../Models/nc_games_models');
const endpoints = require('../endpoints.json');
const { request } = require('express');

exports.getAllEndPoints = (req, res) => {
  res.send(endpoints);
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
      console.log(err, 'err in controller');
      next(err);
    });
};

exports.getReviewsSorted = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  console.log(req.query, 'req query in controller');
  selectReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      console.log(err, 'err in the catch');
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

exports.deleteReview = (req, res, next) => {
  const { review_id } = req.params;
  deleteReviewById(review_id)
  .then(() => {
    res.status(204).send('')
  })
  .catch((err) => {
    next(err)
    })
  }

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
  updateReviewVotes(review_id, req.body)
    .then((updatedReview) => {
      res.status(200).send({ review: updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res, next) => {
  console.log(req, 'req in controller');
  fetchAllUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserDataByUsername = (req, res, next) => {
  console.log(req, 'req in controller');
  const { username } = req.params;
  fetchUserDataByUsername(username)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVotes = (req, res, next) => {
  const {comment_id} = req.params;
  console.log(comment_id, 'req controller')
  console.log(req.body, 'req body')
  updatedCommentVotes(comment_id, req.body)
    .then((updatedComment) => {
      console.log(updatedComment)
      res.status(200).send(updatedComment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewReview = (req, res, next) => {
  const newReview = req.body
  addNewReview(newReview)
  .then((review) => {
    res.status(201).send({ review })
  })
  .catch((err) => {
    next(err)
  })
}

exports.postNewCategory = (req, res, next) => {
  const newCategory = req.body
  addNewCategory(newCategory)
  .then((category) => {
    res.status(201).send(category)
  })
  .catch((err) => {
    next(err)
  })
}