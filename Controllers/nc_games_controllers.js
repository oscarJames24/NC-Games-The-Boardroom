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
const { request } = require('express');
const { checkReviewExists, checkCommentExists, checkUserExists } = require('../Utility/functions');

exports.getApi = (req, res) => {
  res.status(200).send(require('../endpoints.json'));
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

exports.patchReviewVotes = (req, res, next) => {
  if (JSON.stringify(Object.keys(req.body)) !== '["inc_votes"]') {
    res.status(200).send({ msg: 'Missing input - review not updated' });
  }

  console.log(req.body);

  const { review_id } = req.params;
  return checkReviewExists(review_id)
    .then((reviewExists) => {
      if (reviewExists) {
        return updateReviewVotes(review_id, req.body).then((updatedReview) => {
          res.status(200).send({ review: updatedReview });
        });
      } else {
        return Promise.reject({ status: 404, msg: 'Reivew ID not found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewsSorted = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  selectReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  console.log(review_id)

  return checkReviewExists(review_id)
    .then((reviewExists) => {
      console.log(reviewExists)
      if (reviewExists) {
        return fetchReviewById(review_id).then((reviews) => {
          res.status(200).send({ reviews });
        });
      } else {
        return Promise.reject({ status: 404, msg: 'Reivew ID not found' });
      }
    })
    .catch((err) => {
      console.log(err, 'err in controller');
      next(err);
    });
};
exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  console.log(review_id);
  return checkReviewExists(review_id)
    .then((reviewExists) => {
      console.log(reviewExists)
      if (reviewExists) {
        return fetchCommentsByReviewId(review_id).then((comments) => {
          console.log(comments);
          res.status(200).send(comments);
        });
      } else {
        return Promise.reject({ status: 404, msg: 'Reivew ID not found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  return checkCommentExists(comment_id)
    .then((commentExists) => {
      if (commentExists) {
        return removeCommentById(comment_id).then(() => {
          res.status(204).send('');
        });
      } else {
        return Promise.reject({ status: 404, msg: 'Nothing deleted: Comment ID not found' });
      }
    })
    .catch((err) => {
      console.log(err, 'err in controller');
      next(err);
    });
};

exports.deleteReview = (req, res, next) => {
  const { review_id } = req.params;
  deleteReviewById(review_id)
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
  console.log(req.params, 'req in controller');
  const { username } = req.params;
  return checkUserExists(username)
    .then((userExists) => {
      if (userExists) {
        return fetchUserDataByUsername(username).then((user) => {
          res.status(200).send(user);
        });
      } else {
        return Promise.reject({ status: 404, msg: 'Username not found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  console.log(comment_id, 'req controller');
  console.log(req.body, 'req body');
  updatedCommentVotes(comment_id, req.body)
    .then((updatedComment) => {
      console.log(updatedComment);
      res.status(200).send(updatedComment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewReview = (req, res, next) => {
  const newReview = req.body;
  addNewReview(newReview)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewCategory = (req, res, next) => {
  const newCategory = req.body;
  addNewCategory(newCategory)
    .then((category) => {
      res.status(201).send(category);
    })
    .catch((err) => {
      next(err);
    });
};
