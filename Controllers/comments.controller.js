const {
	fetchCommentsByReviewId,
	removeCommentById,
	insertCommentByReviewId,
	updatedCommentVotes
} = require("../Models/comments.models.js");

const {checkReviewExists, checkCommentExists} = require("../Utility/functions");

exports.getCommentsByReviewId = (req, res, next) => {
	const {review_id} = req.params;
	return checkReviewExists(review_id)
		.then((reviewExists) => {
			if (reviewExists) {
				return fetchCommentsByReviewId(review_id).then((comments) => {
					res.status(200).send(comments);
				});
			} else {
				return Promise.reject({
					status: 404,
					msg: "Reivew ID not found"
				});
			}
		})
		.catch((err) => {
			next(err);
		});
};

exports.deleteComment = (req, res, next) => {
	const {comment_id} = req.params;

	return checkCommentExists(comment_id)
		.then((commentExists) => {
			if (commentExists) {
				return removeCommentById(comment_id).then(() => {
					res.status(204).send("");
				});
			} else {
				return Promise.reject({
					status: 404,
					msg: "Nothing deleted: Comment ID not found"
				});
			}
		})
		.catch((err) => {
			console.log(err, "err in controller");
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

exports.patchCommentVotes = (req, res, next) => {
	const {comment_id} = req.params;
	console.log(comment_id, "req controller");
	console.log(req.body, "req body");
	updatedCommentVotes(comment_id, req.body)
		.then((updatedComment) => {
			console.log(updatedComment);
			res.status(200).send(updatedComment);
		})
		.catch((err) => {
			next(err);
		});
};
