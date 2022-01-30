const {
  selectReviews,
  addNewReview,
  deleteReviewById,
  updateReviewVotes,
  fetchReviewById,
} = require('../Models/reviews.models');

const { checkReviewExists } = require('../Utility/functions');

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

exports.patchReviewVotes = (req, res, next) => {
  if (JSON.stringify(Object.keys(req.body)) !== '["inc_votes"]') {
    res.status(200).send({ msg: 'Missing input - review not updated' });
  }

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

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  console.log(review_id);

  return checkReviewExists(review_id)
    .then((reviewExists) => {
      console.log(reviewExists);
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
