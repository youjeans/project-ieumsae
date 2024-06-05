//app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const db = require('./config/mysql');
const multer = require('multer'); // multer 추가
const fs = require('fs'); // 파일 시스템 모듈 추가

// 라우터들 가져오기
const userRoutes = require('./routes/userRoutes');
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const friendRoutes = require('./routes/friendRoutes');
const listRoutes = require('./routes/listRoutes'); // listRoutes 가져오기
const diaryPageRouters = require('./routes/diaryPageRouters'); // diarypage 라우트 등록
const diaryAlarmRouters = require('./routes/diaryAlarmRouters'); // diaryalarm 라우트 등록
const diaryRoutes = require('./routes/diaryRoutes'); // diary 라우트 등록
const mypageRoutes = require('./routes/mypageRoutes'); 
// const diaryController = require('./controllers/diaryController');

const app = express();
const port = process.env.PORT || 3000;

// 업로드 디렉토리 존재 확인 및 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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
    res.locals.userProfilePic = ""; // 기본값 설정
    if (req.session.member) {
        res.locals.id = req.session.member.아이디;
        res.locals.name = req.session.member.이름;
        res.locals.userProfilePic = req.session.member.프로필사진경로;
    }
    next();
});

// multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 라우터 설정
app.use('/api', userRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/friends', friendRoutes);
app.use('/list', listRoutes); 
app.use('/diaryPage', diaryPageRouters);
app.use('/diaryAlarm', diaryAlarmRouters);
app.use('/diary', diaryRoutes);
app.use('/mypage', mypageRoutes);



// 프로필 사진 업로드 라우트 추가
app.post('/mypage/uploadProfilePic', upload.single('profilePic'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const userId = req.session.member.회원번호; // 세션에서 사용자 ID를 가져옴
    const newProfilePicPath = `/uploads/${req.file.filename}`;

    const query = 'UPDATE 사용자 SET 프로필사진경로 = ? WHERE 회원번호 = ?';
    db.query(query, [newProfilePicPath, userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database query error.' });
        }

        res.json({ success: true, newProfilePicPath: newProfilePicPath });
    });
});


// 메인 페이지에서 책을 동적으로 증가시키기 위해 사용
const { getExchangeInfo } = require('./models/exchangePartnersModel');
app.use((req, res, next) => {
    if (!req.session.member || !req.session.member.회원번호) {
        next();
    }
    else {
        getExchangeInfo(req, res, ()=> {
            next();
        });
    }
});

app.get('/', (req, res) => {
    const userProfilePic = res.locals.userProfilePic;
    res.render('index', {
        myname: req.myname,
        exchangePartners: req.exchangePartners,
        count: req.count,
        userProfilePic: userProfilePic
    });
});


// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});