const { fetchAllCategories, fetchReviewById } = require('../Models/nc_games_models')

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
    fetchReviewById()
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        console.log(err)
    })
}