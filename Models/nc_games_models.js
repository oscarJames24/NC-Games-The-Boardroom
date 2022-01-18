const db = require('../db/connection.js');

exports.fetchAllCategories = () => {
    return db.query('SELECT * FROM categories;').then((result) => {
        return result.rows
    })
}

exports.fetchReviewById = () => {
    return db.query(`SELECT * FROM reviews;`).then((result) => {
        return result.rows
    })
}