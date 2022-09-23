const express = require("express");

const {
	getAllCategories,
	postNewCategory
} = require("../Controllers/categories.controller");

const categoriesRouter = express.Router();

categoriesRouter.route("/").get(getAllCategories).post(postNewCategory);

module.exports = categoriesRouter;

//
