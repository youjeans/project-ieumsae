var mysql = require("mysql2");

var db_info = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "ieumsae",
};

var db;

function handleDisconnect() {
    db = mysql.createConnection(db_info); // MySQL 연결 생성

    db.connect(function (err) { // 연결 시도
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // 2초 후에 다시 연결 시도
        } else {
            console.log('Connected to the database.');
        }
    });

    db.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // 연결이 끊어졌을 때
            handleDisconnect(); // 재연결 시도
        } else {
            throw err; // 다른 에러일 경우 throw
        }
    });
}

handleDisconnect();

module.exports = db;
