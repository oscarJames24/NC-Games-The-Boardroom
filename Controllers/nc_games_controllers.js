const { fetchAllCategories, fetchReviewById, selectReviews, fetchCommentsByReviewId, removeCommentById } = require('../Models/nc_games_models')

exports.getWelcomeMessage = (req, res) => {
    res.status(200).send({ message: 'all ok' });
  };

exports.getAllCategories = (req, res, next) => {
    fetchAllCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        console.log(err)
    })
}

exports.getReviewById = (req, res, next) => {
    // const review_ID = req.params.review_id
    // fetchReviewById(review_ID)
    fetchReviewById(req.params.review_id)
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        console.log(err)
    })
}

exports.getReviewsSorted = (req, res, next) => {
    const { sort_by, order, category } = req.query;
    //console.log(req, 'req query getRevsSorted')
    selectReviews(sort_by, order, category)
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        console.log(err)
    })
}

exports.getCommentsByReviewId = (req, res, next) => {
    fetchCommentsByReviewId(req.params.review_id)
    .then((comments) => {
      console.log(comments, 'comments back in controller')
        res.status(200).send(comments)
    })
    .catch((err) => {
        console.log(err)
    })
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id)
    .then(() => {
        res.status(204).send('');
    })
    .catch((err) => {
        console.log(err, 'err in controller')
        next(err)
    })
}