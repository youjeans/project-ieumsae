// mysql2 패키지 로드
var mysql = require('mysql2');

// 환경 변수로부터 MySQL 접속 정보 설정
var db_info = {
    host: 'localhost', // 또는 '127.0.0.1'
    port: "3306",
    user: 'root', // MySQL의 로컬 사용자명 (기본값은 'root')
    password: 'mypassword', // MySQL의 로컬 비밀번호 입력
    database: 'ieumsae' // 사용할 데이터베이스명
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
