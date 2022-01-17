const { fetchAllCategories } = require('../Models/nc_games_models')

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