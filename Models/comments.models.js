const db = require('../db/connection.js');

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

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
        WHERE comment_id=$1
        RETURNING*`,
      [comment_id]
    )
    .then((result) => {
      return result.rows;
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
