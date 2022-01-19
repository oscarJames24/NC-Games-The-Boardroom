const db = require('../db/connection.js');

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
    console.log(sort_by, 'sort by')
    console.log(order, 'order')
    console.log(category, 'cat')

  const validKeys = [
      'review_id',
      'title',
      'designer',
      'votes', 
      'category',
      'owner',
      'created_at'
    ];

 // code stumbles here.... need fail safe if incorrect key is passed
//   if (!validKeys.includes(sort_by) || !validKeys.includes(order)) {
//     return Promise.reject({ status: 400, msg: 'Bad Request (from valid keys reject)' });
//   }

  let queryString = `SELECT * FROM reviews`;
  const queryValues = [];

  if (category) {
    queryString += ` WHERE category = $1`;
    queryValues.push(category);
  }

  queryString += ` ORDER BY ${sort_by} ${order}`;


  return db.query(queryString, queryValues).then(({ rows }) => {
    console.log(rows, 'query return');
    return rows;
  });
};

exports.fetchCommentsByReviewId = (review_id) => {
return db.query(`SELECT comment_id, votes, created_at, author, body FROM comments 
WHERE review_id=$1`, 
[review_id])
.then((res) => {
   // console.log(res.rows);
    return res.rows;
})
}

exports.removeCommentById = (comment_id) => {
  return db.query(`DELETE FROM comments
  WHERE comment_id=$1
  RETURNING*`, [comment_id])
  .then((res) => {
    console.log(res.rowCount, 'row count')
    if (res.rowCount !== 1) {
      return Promise.reject({status: 404 , msg: 'Nothing deleted - Restaurant ID does not exist'})
  }
  })
}

exports.insertCommentByReviewId = (review_id, newComment) => {
  const { username, body } = newComment;
  return db.query(`INSERT INTO comments (author, review_id, body) VALUES ($1, $2, $3) RETURNING*;`,[username, review_id, body])
  .then((res) => {
    return res.rows[0]
  })
}
