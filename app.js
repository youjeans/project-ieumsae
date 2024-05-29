// 기본 설정
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');

const database = require('./config/mysql'); // mysql 설정

const port = 3000; // 포트 번호 설정

// 미들웨어 설정
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 뷰 엔진 ejs 설정
app.set('view engine', 'ejs');

// 정적 파일 설정
app.use(express.static(path.join(__dirname, 'public')));
  

// 라우터 정의 및 사용
const diaryPageRouters = require('./routes/diaryPageRouters');
app.use('/diaryPage', diaryPageRouters);

const diaryAlarmRouters = require('./routes/diaryAlarmRouters');
app.use('/diaryAlarm', diaryAlarmRouters);


app.get('/form', (req, res) => {
    res.render('form');
});

app.post('/postForm', (req, res) => {
    console.log(req.body);
    res.render('result', {data: req.body});
});

// 포트 liseten
app.listen(port, () => {
    console.log('Server Open : ', port);
});
