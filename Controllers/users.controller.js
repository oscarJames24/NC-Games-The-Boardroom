const {
	fetchAllUsers,
	fetchUserDataByUsername
} = require("../Models/users.models");

const {checkUserExists} = require("../Utility/functions");

exports.getAllUsers = (req, res, next) => {
	fetchAllUsers()
		.then((users) => {
			res.status(200).send(users);
		})
		.catch((err) => {
			next(err);
		});
};

exports.getUserDataByUsername = (req, res, next) => {
	const {username} = req.params;
	return checkUserExists(username)
		.then((userExists) => {
			if (userExists) {
				return fetchUserDataByUsername(username).then((user) => {
					res.status(200).send(user);
				});
			} else {
				return Promise.reject({status: 404, msg: "Username not found"});
			}
		})
		.catch((err) => {
			next(err);
		});
};

// exports.patchCommentVotes = (req, res, next) => {
//   const { comment_id } = req.params;
//   console.log(comment_id, 'req controller');
//   console.log(req.body, 'req body');
//   updatedCommentVotes(comment_id, req.body)
//     .then((updatedComment) => {
//       console.log(updatedComment);
//       res.status(200).send(updatedComment);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
