const db = require('../db/connection');

exports.fetchAllUsers = () => {
  return db.query('SELECT username avatar_url FROM users;').then((result) => {
    return result.rows;
  });
};

exports.fetchUserDataByUsername = (username) => {
  return db.query(`SELECT * FROM users WHERE username=$1`, [username]).then((result) => {
    return result.rows[0];
  });
};
