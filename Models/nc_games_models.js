const db = require('../db/connection.js');
const fs = require('fs/promises')
const { checkCategoryExists } = require('../Utility/functions');

exports.fetchAllCategories = () => {
  return db.query('SELECT * FROM categories;').then((result) => {
    return result.rows;
  });
};

exports.fetchReviewById = (review_ID) => {
  return db.query(`SELECT * FROM reviews WHERE review_id=$1`, [review_ID]).then((res) => {
    return res.rows[0];
  });
};

exports.selectReviews = (sort_by = 'created_at', order = 'DESC', category) => {

  // all working here in terms of throwin the error (logged in testing error) but isn't caught in the controller so doesn't pass the test.

  const allowedSortBys = ['title', 'designer', 'votes', 'category', 'owner', 'created_at'];
  if (!allowedSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Bad Request - unsortable' });
  }

  const allowedOrder = ['ASC', 'DESC', 'asc', 'desc', 'Asc', 'Desc'];
  if (!allowedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad Request - order' });
  }

  const queryValues = [];
  let queryString = `SELECT * FROM reviews`;


  if (category) {
    checkCategoryExists(category).then((res) => {
      if (res === 0) {
        return Promise.reject({ status: 400, msg: 'Bad Request - category does not exist' });
      } 
    });
  }

  if (category) {
  queryString += ` WHERE category = $1`;
  queryValues.push(category);
  }

  console.log(queryString, 'query string')
  console.log(queryValues, 'query values')

  queryString += ` ORDER BY ${sort_by} ${order}`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByReviewId = (review_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments 
WHERE review_id=$1`,
      [review_id]
    )
    .then((res) => {
      return res.rows;
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
  WHERE comment_id=$1
  RETURNING*`,
      [comment_id]
    )
    .then((res) => {
      if (res.rowCount !== 1) {
        return Promise.reject({
          status: 404,
          msg: 'Nothing deleted - Restaurant ID does not exist',
        });
      }
    });
};

exports.insertCommentByReviewId = (review_id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(`INSERT INTO comments (author, review_id, body) VALUES ($1, $2, $3) RETURNING*;`, [
      username,
      review_id,
      body,
    ])
    .then((res) => {
      console.log(res);
      return res.rows[0];
    });
};

exports.updateReviewVotes = (review_id, reviewToUpdate) => {
  const { inc_votes } = reviewToUpdate;
  return db
  .query(`UPDATE reviews SET votes = votes + $1 WHERE article_id=$2 RETURNING*;`,
  [inc_votes, review_id])
  .then((res) => {
    return res.rows[0];
  })
}
