const express = require('express');

const { deleteComment, patchCommentVotes } = require('../Controllers/comments.controller');
// require in from categories controller

const commentsRouter = express.Router();

commentsRouter.route('/:comment_id').delete(deleteComment).patch(patchCommentVotes);

module.exports = commentsRouter;

//
