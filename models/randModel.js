// userModel.js
const mysql = require('mysql2');
const connection = require('../config/database');

// 사용자 테이블에서 회원번호, 이름, 관심사를 가져오는 함수
function getUsers(callback) {
  const sql = 'SELECT 회원번호, 이름, 관심사 FROM 사용자';
  connection.query(sql, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
}

function getRandomUserBySameInterest(userId, callback) {
  const sql = 'SELECT 회원번호, 이름 FROM 사용자 WHERE 관심사 = (SELECT 관심사 FROM 사용자 WHERE 회원번호 = ?) AND 회원번호 != ?';
  connection.query(sql, [userId, userId], (err, results) => {
    if (err) {
      return callback(err);
    }
    if (results.length === 0) {
      return callback(null, null); // 관심사가 같은 사용자가 없는 경우
    }
    const randomIndex = Math.floor(Math.random() * results.length);
    callback(null, results[randomIndex]);
  });
}



// 사용자 ID를 기반으로 사용자 정보를 가져오는 함수
function getUsersByUserIds(userIds, callback) {
  const sql = 'SELECT 회원번호, 이름 FROM 사용자 WHERE 회원번호 IN (?)';
  connection.query(sql, [userIds], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
}

module.exports = {
  getUsers,
  getRandomUserBySameInterest,
  getUsersByUserIds
};
