// diaryModel.js
const mysql = require('mysql2');
const connection = require('../config/mysql');
const loginController = require('../controllers/loginController');


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

function adjustKoreanTime(date) {
  const KST_OFFSET = 9 * 60 * 60 * 1000; // 한국 시간 오프셋 (밀리초 단위)
  const koreaTime = new Date(date.getTime() + KST_OFFSET);
  return koreaTime.toISOString().slice(0, 19).replace('T', ' '); // ISO 포맷에서 "YYYY-MM-DD HH:MM:SS" 형태로 변환
}


function createDiary(diaryData, 작성자_번호, callback) {
  const { 교환대상, 일기_내용, 교환유형 } = diaryData;
  //const 작성자_번호 = req.session.member.회원번호;
  const 일기_작성일 = adjustKoreanTime(new Date());
  //const 교환유형 = 작성자_번호 === 교환대상 ? 0 : 1;

  let 일기_송신일;
if (교환유형 === 0) {
  // 교환유형이 0이면 일기 송신일을 현재 시간으로부터 1년 뒤로 설정
  일기_송신일 = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
} else {
  // 교환유형이 1 또는 2이면 다음 날 자정으로 설정
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  일기_송신일 = tomorrow;
}


const sql = 'INSERT INTO 일기 (작성자_번호, 수신자_번호, 일기_내용, 일기_작성일, 일기_송신일, 교환유형) VALUES (?, ?, ?, ?, ?, ?)';
connection.query(sql, [작성자_번호, 교환대상, 일기_내용, 일기_작성일, 일기_송신일, 교환유형], (err, result) => {
  if (err) return callback(err);
  const sql2 = 'INSERT INTO 일기교환기록 (송신자_번호, 수신자_번호, 송신일시, 수신일시, 조회여부) VALUES (?, ?, ?, ?, ?)';
  const value2 = [작성자_번호, 교환대상, 일기_작성일, 일기_송신일, 0];
  connection.query(sql2, value2, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
    })
  });
}

module.exports = {
  createDiary
};
