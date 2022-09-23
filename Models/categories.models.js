const db = require("../db/connection");

exports.fetchAllCategories = () => {
	return db.query("SELECT * FROM categories;").then((result) => {
		return result.rows;
	});
};

exports.addNewCategory = (newCategory) => {
	const {slug, description} = newCategory;
	return db
		.query(
			`INSERT INTO categories (slug, description)
        VALUES ($1, $2)
        RETURNING*;`,
			[slug, description]
		)
		.then((res) => {
			return res.rows[0];
		});
};
