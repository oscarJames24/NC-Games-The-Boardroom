const db = require('../db/connection');

exports.checkCategoryExists = (category) => {
    return db.query('SELECT * FROM categories WHERE slug=$1;', [category])
    .then((res) => {
        const matchingCategories = res.rows.length;
        return matchingCategories
        })
}