const express = require('express');
const path = require('path');
const session = require('express-session'); // express-session 패키지 추가
const diaryController = require('./controllers/diaryController');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// express-session 미들웨어 설정
app.use(session({
    secret: 'ieumsae', // 비밀 키
    resave: false,
    saveUninitialized: true
  }));
  
  // req 객체 임시 정의하는 미들웨어 추가
  app.use((req, res, next) => {
    if (!req.session.member) {
      req.session.member = { 회원번호: 1 }; // 임시 회원번호 설정
    }
    console.log('Session:', req.session); // 세션 로그 추가
    next();
  });

app.get('/form', diaryController.renderForm);
app.get('/getForm', diaryController.handleGetForm);
app.post('/postForm', diaryController.handlePostForm);

const server = app.listen(port, () => {
    console.log('Server Open : ', port);
});
