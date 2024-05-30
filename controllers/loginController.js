var db = require('../config/mysql');

exports.displayloginPage = (req, res) => {
    res.render("login");
};

exports.displaysignupPage = (req, res) => {
    res.render("signup");
};

exports.login = (req, res) => {
    const id = req.body.아이디;
    const pw = req.body.비밀번호;

    //const hashedpw = crypto.pbkdf2Sync(pw, salt, 1000, 64, 'sha512').toString('hex');

    const sql = 'select * from 사용자  where 아이디=? and 비밀번호=? '
    const values = [id, pw];

    db.query(sql, values, function(err, result){
        if(err) throw err;
        if(result.length==0){ // 로그인 실패
            res.send("<script> alert('잘못된 로그인입니다..!'); location.href='/login';</script>");
        } else{ // 로그인 성공
            console.log(result[0]);
            req.session.member = result[0] // 로그인한 값을 session.member에 저장
            // 로그인 성공시 메인 페이지로 이동
            res.send("<script> alert('로그인 되었습니다.'); location.href='/';</script>"); 
        }
    })
}

exports.logout = (req, res) => {
    req.session.member = null;
    res.send("<script>alert('로그아웃 되었습니다.'); location.href='/';</script>");
};


