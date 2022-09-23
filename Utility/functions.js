const db = require("../db/connection");

exports.checkCategoryExists = (category) => {
	return db
		.query("SELECT * FROM categories WHERE slug=$1;", [category])
		.then((res) => {
			const matchingCategories = res.rows.length;
			return matchingCategories;
		});
};

exports.checkUserExists = (username) => {
	return db
		.query("SELECT * FROM users WHERE username=$1;", [username])
		.then(({rows}) => {
			console.log(rows);
			if (rows.length) {
				return true;
			} else {
				return false;
			}
		});
};

exports.checkReviewExists = (review_id) => {
	return db
		.query("SELECT * FROM reviews WHERE review_id=$1;", [review_id])
		.then(({rows}) => {
			console.log(rows);
			if (rows.length) {
				return true;
			} else {
				return false;
			}
		});
};
exports.checkCommentExists = (comment_id) => {
	return db
		.query("SELECT * FROM comments WHERE comment_id=$1;", [comment_id])
		.then(({rows}) => {
			if (rows.length) {
				return true;
			} else {
				return false;
			}
		});
};
