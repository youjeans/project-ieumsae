// 환경 변수 로드를 위한 dotenv 패키지 로드
require('dotenv').config();

// mysql2 패키지 로드
var mysql = require('mysql2');

// 환경 변수로부터 MySQL 접속 정보 설정
var db_info = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

// MySQL 연결 생성 및 연결
var db = mysql.createConnection(db_info);
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

// db 객체를 모듈로 내보내기

module.exports = db;

