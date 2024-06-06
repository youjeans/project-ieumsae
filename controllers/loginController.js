var db = require('../config/mysql');
const crypto = require('crypto');
//const salt = require('../config/salt')

exports.displayloginPage = (req, res) => {
    res.render("login");
};

exports.displaysignupPage = (req, res) => {
    res.render("signup");
};

exports.login = (req, res) => {
    const id = req.body.아이디;
    const pw = req.body.비밀번호;

    db.query('SELECT * FROM 사용자 WHERE 아이디=?', [id], function(error, result, fields){
        if(error) throw error;
        if(result.length==0) {
            res.send("<script> alert('존재하지 않는 아이디입니다..!'); location.href='/login';</script>"); 
        }else {
            const salt = result[0].해시;
            if(salt!== null) {var hashedpw = crypto.pbkdf2Sync(pw, salt, 1000, 64, 'sha512').toString('hex');}
            else hashedpw = pw;
            db.query('SELECT * FROM 사용자 WHERE 아이디 = ? and 비밀번호 =?', [id, hashedpw], function(err, result){
            if(error) throw error;
            if(result.length==0){ // 로그인 실패
                res.send("<script> alert('비밀번호가 일치하지 않습니다..!'); location.href='/login';</script>");
            } else{ // 로그인 성공
                console.log(result[0]);
                req.session.member = result[0] // 로그인한 값을 session.member에 저장
                // 로그인 성공시 메인 페이지로 이동
                res.send("<script> alert('로그인 되었습니다.'); location.href='/';</script>"); 
            }
            })
        }
    });
};

exports.logout = (req, res) => {
    req.session.member = null;
    res.send("<script>alert('로그아웃 되었습니다.'); location.href='/';</script>");
};

