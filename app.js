// 기본 설정
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const db = require('./config/mysql'); // mysql 설정

// 미들웨어 설정
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 뷰 엔진 ejs 설정
app.set('view engine', 'ejs');

// 세션 설정
app.use(express.json());
app.use(session({secret:  'ieumsae', cookie: {maxAge: 60000}, resave:true, saveUninitialized:true,}));
app.use((req, res, next) => {
    res.locals.id = "";
    res.locals.name = "";
    if(req.session.member){
    res.locals.id = req.session.member.아이디;
    res.locals.name = req.session.member.이름;
    }
    next()
  })

// 정적 파일 설정
app.use(express.static(path.join(__dirname, 'public')));
  

// 라우터 정의 및 사용
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const signupRoutes = require('./routes/signupRoutes') // signup 라우트 등록
app.use('/signup', signupRoutes); 

const loginRoutes = require('./routes/loginRoutes') //login 라우트 등록
app.use('/login', loginRoutes); 


const diaryPageRouters = require('./routes/diaryPageRouters'); //  diaryPage 라우트 등록
app.use('/diaryPage', diaryPageRouters);

const diaryAlarmRouters = require('./routes/diaryAlarmRouters'); // diaryAlarm 라우트 등록
app.use('/diaryAlarm', diaryAlarmRouters);

const {getExchangePartners} = require('./controllers/exchangePartners');
app.use((req, res, next) => { 
    if (!req.session.member || !req.session.member.회원번호) { // 로그인 상태에서만 접근 가능하도록 설정
        next();
    } else {
        getExchangePartners(req, res, ()=> {
            next();
        });
    }
});

app.get('/', (req, res) => {
    res.render('test', {exchangePartners: req.exchangePartners })
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.post('/postForm', (req, res) => {
    console.log(req.body);
    res.render('result', {data: req.body});
});

// 포트 liseten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
