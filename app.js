const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const db = require('./config/mysql');

// 라우터들 가져오기
const userRoutes = require('./routes/userRoutes');
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const friendRoutes = require('./routes/friendRoutes');
const listRoutes = require('./routes/listRoutes'); // listRoutes 가져오기
const mypageRoutes = require('./routes/mypageRoutes'); 

const app = express();
const port = process.env.PORT || 3000;

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

// EJS를 템플릿 엔진으로 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(session({
    secret: 'ieumsae',
    cookie: { maxAge: 36000000 },
    resave: true,
    saveUninitialized: true,
}));

// 세션 설정
app.use((req, res, next) => {
    res.locals.id = "";
    res.locals.name = "";
    if (req.session.member) {
        res.locals.id = req.session.member.아이디;
        res.locals.name = req.session.member.이름;
    }
    next();
});

// 라우터 설정
app.use('/api', userRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/friends', friendRoutes);
app.use('/list', listRoutes);
app.use('/mypage', mypageRoutes);

// 기본 라우트
app.get('/', (req, res) => {
    res.render('index');
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const db = require('./config/mysql');

// 라우터들 가져오기
const userRoutes = require('./routes/userRoutes');
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const friendRoutes = require('./routes/friendRoutes');
const listRoutes = require('./routes/listRoutes'); // listRoutes 가져오기
const diaryPageRouters = require('./routes/diaryPageRouters'); // diarypage 라우트 등록
const diaryAlarmRouters = require('./routes/diaryAlarmRouters'); // diaryalarm 라우트 등록
const diaryRoutes = require('./routes/diaryRoutes'); // diary 라우트 등록
// const diaryController = require('./controllers/diaryController');

const app = express();
const port = process.env.PORT || 3000;

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

// EJS를 템플릿 엔진으로 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(session({
    secret: 'ieumsae',
    cookie: { maxAge: 36000000 },
    resave: true,
    saveUninitialized: true,
}));

// 세션 설정
app.use((req, res, next) => {
    res.locals.id = "";
    res.locals.name = "";
    if (req.session.member) {
        res.locals.id = req.session.member.아이디;
        res.locals.name = req.session.member.이름;
    }
    next();
});

// 라우터 설정
app.use('/api', userRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/friends', friendRoutes);
app.use('/list', listRoutes); 
app.use('/diaryPage', diaryPageRouters);
app.use('/diaryAlarm', diaryAlarmRouters);
app.use('/diary', diaryRoutes);


// 메인 페이지에서 책을 동적으로 증가시키기 위해 사용
const { getExchangePartners } = require('./models/exchangePartnersModel');
app.use((req, res, next) => {
    if (!req.session.member || !req.session.member.회원번호) next();
        else {
        getExchangePartners(req, res, ()=> {
            next();
        });
    }
});

// 기본 라우트
app.get('/', (req, res) => {
    res.render('index', {myname: req.myname, exchangePartners: req.exchangePartners, exchangenum: req.exchangePartnersCount});
});


// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

