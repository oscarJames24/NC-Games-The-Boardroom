const db = require('../db/connection.js');
const fs = require('fs/promises');
const { checkCategoryExists } = require('../Utility/functions');

exports.fetchAllCategories = () => {
  return db.query('SELECT * FROM categories;').then((result) => {
    return result.rows;
  });
};

exports.fetchReviewById = (review_ID) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
     FROM reviews 
     LEFT JOIN comments
     ON reviews.review_id = comments.review_id
     WHERE reviews.review_id=$1
     GROUP BY reviews.review_id`,
      [review_ID]
    )
    .then((res) => {
      return res.rows[0]
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
  
  exports.updateReviewVotes = (review_id, voteIncrement) => {
    const { inc_votes } = voteIncrement;
    return db
    .query(`UPDATE reviews SET votes = votes + $1 WHERE review_id=$2 RETURNING*;`, [
      inc_votes,
      review_id,
    ])
    .then((res) => {
      return res.rows[0];
    });
  };
  exports.fetchAllUsers = () => {
    return db.query('SELECT username FROM users;').then((result) => {
      return result.rows;
    });
  };
  
  exports.fetchUserDataByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username=$1`, [username]).then((result) => {
      return result.rows[0];
    });
  };
  
  exports.updatedCommentVotes = (comment_id, voteIncrement) => {
    const { inc_votes } = voteIncrement;
    return db
    .query(`UPDATE comments SET votes = votes + $1 WHERE comment_id=$2 RETURNING*;`, [
      inc_votes,
      comment_id,
    ])
    .then((res) => {
      return res.rows[0];
    });
  };
  
  exports.selectReviews = (sort_by = 'created_at', order = 'DESC', category) => {
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
      queryString += ` WHERE category = $1`;
      queryValues.push(category);
    }
    queryString += ` ORDER BY ${sort_by} ${order}`;
    console.log(queryString, 'line106')
  
    return db.query(queryString, queryValues).then(({ rows }) => {
      if (category) {
        return checkCategoryExists(category).then((res) => {
          if (res === 0) {
            return Promise.reject({ status: 404, msg: 'Bad Request - category does not exist' });
          } else {
            return rows;
          }
        });
      }
      return rows;
    });
  };

exports.addNewReview = (newReview) => {
  console.log(newReview, 'in model');
  const { owner, title, review_body, designer, category } = newReview;
  return db
    .query(
      `INSERT INTO reviews (owner, title, review_body, designer, category) 
    VALUES ($1,$2,$3,$4,$5)
    RETURNING*;`,
      [owner, title, review_body, designer, category]
    )
    .then((result) => {
      const { review_id } = result.rows[0];
      return db
        .query(
          `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON comments.review_id = reviews.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;`,
          [review_id]
        )
        .then((res) => {
          return res.rows[0];
        });
    });
};

exports.addNewCategory = (newCategory) => {
  console.log(newCategory, 'in model');
  const { slug, description } = newCategory;
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

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
      WHERE comment_id=$1
      RETURNING*`,
      [comment_id]
    )
    .then((result) => {
        return result.rows
    });
};

exports.deleteReviewById = (review_id) => {
  return db
    .query(
      `DELETE FROM reviews
      WHERE review_id=$1
      RETURNING*`,
      [review_id]
    )
    .then((result) => {
      if (result.rowCount !== 1) {
        return Promise.reject({
          status: 404,
          msg: 'Nothing deleted - Review ID does not exist',
        });
      } else {
        return result.rows
      }
    });
};
