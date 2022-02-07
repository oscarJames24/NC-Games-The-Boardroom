const { fetchAllCategories, addNewCategory } = require('../Models/categories.models');

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
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
