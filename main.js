// 기본 설정
const express = require('express');
const app = express();
const path = require("path");

const port = 3000; // 포트 번호 설정

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.set('view engine', 'ejs'); // 뷰 엔진 ejs 설정

// 데이터베이스 연결 설정
const sequelize = require('./config/database');
const diaryDatabase = require('./models/diaryDatabase');
const diaryExchange = require('./models/diaryExchange');

// 미들웨어 설정
app.use(express.json());

// 데이터베이스에 연결
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// 데이터베이스와 모델 동기화
sequelize.sync()
    .then(() => {
        console.log('Database synchronized successfully.');
    })
    .catch(err => {
        console.error('Unable to synchronize the database:', err);
    });


app.get('/form', (req, res) => {
    res.render('form');
});

app.get('/getForm', (req, res) => {
    console.log(req.query);
    res.send('get 요청 성공');
});

app.post('/postForm', (req, res) => {
    console.log(req.body);
    res.render('result', {data: req.body});
});

app.listen(port, () => {
    console.log('Server Open : ', port);
});
