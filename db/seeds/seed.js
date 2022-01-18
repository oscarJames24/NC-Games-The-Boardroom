const db = require('../connection');
const format = require('pg-format');
const {dropTables, createTables, insertDat, insertData } = require('../../Utility/seed-functions')
const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  // SEED FUNCTION SHEET SET UP - REVISIT TO GE WORKING - didn't seem to be dropping tables
  // dropTables();
  // createTables();
  // insertData();
  return (
    db
      .query(`DROP TABLE IF EXISTS comments;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS reviews;`).then(() => {
          return db.query(`DROP TABLE IF EXISTS users;`).then(() => {
            return db.query(`DROP TABLE IF EXISTS categories;`);
          });
        });
      })
      .then(() => {
        return db.query(`
    CREATE TABLE categories (
        slug VARCHAR(255) PRIMARY KEY,
        description VARCHAR(500) NOT NULL
    )
    ;`);
      })
      .then(() => {
        return db.query(`
    CREATE TABLE users (
        username VARCHAR(255) PRIMARY KEY,
        avatar_url VARCHAR(2048) NOT NULL,
        name VARCHAR(255) NOT NULL
    );`);
      })
      .then(() => {
        return db.query(`
      CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        review_body VARCHAR(1000) NOT NULL,
        designer VARCHAR(255) NOT NULL,
        review_img_url VARCHAR(2048) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        votes INT DEFAULT 0 NOT NULL,
        category VARCHAR(255) REFERENCES categories(slug),
        owner VARCHAR(255) REFERENCES users(username),
        created_at DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`);
      })
      .then(() => {
        return db.query(`
      CREATE TABLE comments (     
        comment_id INT PRIMARY KEY,
        author VARCHAR(255) REFERENCES users(username),
        review_id INT REFERENCES reviews(review_id)
        votes INT DEFAULT 0 NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        body VARCHAR(1000) NOT NULL 
      );`);
      })
      .then(() => {
        console.log('ALL TABLES CREATED');
      })
      // INSERT DATA
      .then(() => {
        const formattedCategoryData = categoryData.map((category) => [
          category.slug,
          category.description,
        ]);
        const sqlCategory = format(
          `INSERT INTO categories (slug, description) VALUES %L RETURNING*;`,
          formattedCategoryData
        );
        return db.query(sqlCategory);
      })
      .then(() => {
        const formattedUserData = userData.map((user) => [
          user.username,
          user.name,
          user.avatar_url,
        ]);
        const sqlUsers = format(
          `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING*;`,
          formattedUserData
        );
        return db.query(sqlUsers);
      })
      .then(() => {
        const formattedReviewData = reviewData.map((review) => [
          review.title,
          review.review_body,
          review.designer,
          review.owner,
          review.review_img_url,
          review.category,
          review.created_at,
          review.votes,
        ]);
        const sqlReviews = format(
          `INSERT INTO reviews (title, review_body, designer, owner, review_img_url, category, created_at, votes) VALUES %L RETURNING*;`,
          formattedReviewData
        );
        return db.query(sqlReviews);
      })
      .then(() => {
        const formattedCommentData = commentData.map((comment) => [
          comment.body,
          comment.votes,
          comment.author,
          comment.review_id,
          comment.created_at,
        ]);
        const sqlComments = format(
          `INSERT INTO comments (body, votes, author, review_id, created_at) VALUES %L RETURNING*;`,
          formattedCommentData
        );
        return db.query(sqlComments);ç
      })
      .then(() => {
        console.log('ALL DATA INSERTED');
      })
  );
};

module.exports = seed;
