const express = require('express');

const { getAllUsers, getUserDataByUsername } = require('../Controllers/categories.controller');
// require in from categories controller

const usersRouter = express.Router();

usersRouter.route('/').get(getAllUsers);
usersRouter.route('/:username').get(getUserDataByUsername);

module.exports = usersRouter;

//
