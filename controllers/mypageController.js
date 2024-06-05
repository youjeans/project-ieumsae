//mypageController.js
const crypto = require('crypto');
var db = require('../config/mysql');
const salt = require('../config/salt');
const multer = require('multer');
const path = require('path');

const interestsMapping = {
    0: '스타/연예인',
    1: '스포츠',
    2: '문학/책',
    3: '영화/드라마',
    4: '반려동물',
    5: '요리',
    6: '여행',
    7: '건강/의학',
    8: '게임',
    9: '자기계발'
};

const genderMapping = {
    0: '남성',
    1: '여성'
};

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

// 사용자 정보 가져오기
exports.displaymyPage = (req, res) => {
    const userId = req.session.member.회원번호;
    const query = 'SELECT 이름, 아이디, 성별, 나이, 이메일, 관심사, 프로필사진경로 FROM 사용자 WHERE 회원번호 = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            const user = results[0];
            const userInfo = {
                user_name: user.이름,
                user_number: user.아이디,
                user_gender: genderMapping[user.성별],
                user_age: user.나이,
                user_email: user.이메일,
                user_interest: interestsMapping[user.관심사],
                user_profile: user.프로필사진경로
            };
            res.render('mypage', { userInfo });
        } else {
            res.status(404).send('User not found');
        }
    });
};

exports.displaydeletePage = (req, res) => {
    res.render("delete");
};

exports.displayPWupdatePage = (req, res) => {
    res.render("pw-update");
};

exports.changePW = (req, res) => {
    const username = req.session.member.아이디; // 세션 정보 가져오기
    
    const currentPassword = req.body.currentPassword; // 현재 비밀번호
    const newPassword = req.body.newPassword; // 새로운 비밀번호
    const newPassword2 = req.body.newPassword2;

    let hashedcurrentPassword; // 변수를 블록 외부에서 선언
   
    // 새로운 비밀번호 해시화
    const hashednewPassword = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512').toString('hex');

    if (newPassword !== newPassword2) {
        return res.send(`<script type="text/javascript">alert("새 비밀번호와 확인용 비밀번호가 일치하지 않습니다."); document.location.href="/mypage/pwUpdatePage";</script>`);
    }

    // 데이터베이스에서 현재 비밀번호 확인
    db.query('SELECT * FROM 사용자 WHERE 아이디 = ?', [username], (error, results, fields) => {
        if (error) {
            console.error('Database query error:', error);
            return res.send(`<script type="text/javascript">alert("Internal Server Error"); document.location.href="/mypage/pwUpdatePage";</script>`);
        }

        if (results.length === 0) {
            return res.send(`<script type="text/javascript">alert("사용자를 찾을 수 없습니다."); document.location.href="/mypage/pwUpdatePage";</script>`);
        }

        const hash = results[0].해시;
        const storedPassword = results[0].비밀번호;
        if (hash !== null) {
            hashedcurrentPassword = crypto.pbkdf2Sync(currentPassword, hash, 1000, 64, 'sha512').toString('hex');
        } else {
            hashedcurrentPassword = currentPassword;
        }

        // 현재 비밀번호 칸에 입력한 비밀번호와 저장된 비밀번호가 일치하는지 확인
        if (storedPassword !== hashedcurrentPassword) { 
            return res.send(`<script type="text/javascript">alert("현재 비밀번호가 올바르지 않습니다."); document.location.href="/mypage/pwUpdatePage";</script>`);
        }

        // 새로운 비밀번호로 업데이트
        db.query('UPDATE 사용자 SET 비밀번호 = ?, 해시 = ? WHERE 아이디 = ?', [hashednewPassword, salt, username], (error, results, fields) => {
            if (error) {
                console.error('Database query error:', error);
                return res.send(`<script type="text/javascript">alert("Internal Server Error"); document.location.href="/mypage/pwUpdatePage";</script>`);
            }

            res.send(`<script type="text/javascript">alert("비밀번호가 성공적으로 변경되었습니다!"); document.location.href="/mypage";</script>`);
        });
    });
};

// 프로필 사진 업로드 함수 추가
exports.uploadProfilePic = (req, res) => {
    const userId = req.session.member.회원번호; // 세션에서 사용자 ID를 가져옴
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const newProfilePicPath = `/uploads/${req.file.filename}`;
    const query = 'UPDATE 사용자 SET 프로필사진경로 = ? WHERE 회원번호 = ?';
    db.query(query, [newProfilePicPath, userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database query error.' });
        }

        res.json({ success: true, newProfilePicPath: newProfilePicPath });
    });
};

// multer를 사용하여 프로필 사진 업로드를 처리하는 미들웨어를 exports에 추가
exports.upload = upload;