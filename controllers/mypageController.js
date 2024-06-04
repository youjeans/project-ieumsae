const crypto = require('crypto');
var db = require('../config/mysql');
const salt = require('../config/salt');

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

exports.displaymyPage = (req, res) => {
        console.log(req.session.member);
        const userInfo = {
        user_name: req.session.member.이름,
        user_number: req.session.member.아이디,
        user_gender: genderMapping[req.session.member.성별],
        user_age: req.session.member.나이,
        user_email: req.session.member.이메일,
        user_interest: interestsMapping[req.session.member.관심사]
    };

    res.render('mypage', { userInfo });
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
   
    // 새로운 비밀번호 해시화
    const hashednewPassword = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512').toString('hex');

    if (newPassword !== newPassword2) {
        return res.send(`<script type="text/javascript">alert("새 비밀번호와 확인용 비밀번호가 일치하지 않습니다.");
        document.location.href="/mypage/pwUpdatePage";</script>`);
    }

    // 데이터베이스에서 현재 비밀번호 확인
    db.query('SELECT * FROM 사용자 WHERE 아이디 = ?', [username], (error, results, fields) => {
        if (error) {
            console.error('Database query error:', error);
            return res.send(`<script type="text/javascript">alert("Internal Server Error");
            document.location.href="/mypage/pwUpdatePage";</script>`);
        }

        if (results.length === 0) {
            return res.send(`<script type="text/javascript">alert("사용자를 찾을 수 없습니다.");
            document.location.href="/mypage/pwUpdatePage";</script>`);
        }

        const hash = results[0].해시;
        const storedPassword = results[0].비밀번호;
        if(hash !== null) {var hashedcurrentPassword = crypto.pbkdf2Sync(currentPassword, hash, 1000, 64, 'sha512').toString('hex');}
        else hashedcurrentPassword = currentPassword;

        // 현재 비밀번호 칸에 입력한 비밀번호와 저장된 비밀번호가 일치하는지 확인
        if (storedPassword !== hashedcurrentPassword) { 
            return res.send(`<script type="text/javascript">alert("현재 비밀번호가 올바르지 않습니다.");
            document.location.href="/mypage/pwUpdatePage";</script>`);
        }

        // 새로운 비밀번호로 업데이트
        db.query('UPDATE 사용자 SET 비밀번호 = ?, 해시 =? WHERE 아이디 = ?', [hashednewPassword, salt, username], (error, results, fields) => {
            if (error) {
                console.error('Database query error:', error);
                return res.send(`<script type="text/javascript">alert("Internal Server Error");
                document.location.href="/mypage/pwUpdatePage";</script>`);
            }

            res.send(`<script type="text/javascript">alert("비밀번호가 성공적으로 변경되었습니다!");
            document.location.href="/mypage";</script>`);
        });
    });
};
