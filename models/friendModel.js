const mysql = require('mysql2');
const connection = require('../config/mysql');
const randModel = require('../models/randModel');

// 특정 사용자의 친구 목록과 이름을 가져오는 함수
function getFriendInfo(userId, callback) {
  const sql = 'SELECT 친구_사용자_번호2 FROM 친구 WHERE 친구_사용자_번호1 = ?';
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      return callback(err);
    }

    // 친구의 사용자 번호를 저장할 배열
    const friendIds = results.map(row => row.친구_사용자_번호2);

    // 친구의 사용자 번호를 사용하여 이름을 가져오는 함수 호출
    randModel.getUsersByUserIds(friendIds, (err, friendInfo) => {
      if (err) {
        return callback(err);
      }

      callback(null, friendInfo);
    });
  });
}

module.exports = {
  getFriendInfo
};
