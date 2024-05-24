const crypto = require('crypto');
var db = require('../config/mysql');
const salt = crypto.randomBytes(16).toString('hex');

exports.displaysignupPage = (req, res) => {
    res.render("signup");
};

exports.signup = (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var name = req.body.name;
    var gender = req.body.gender;
    var age = req.body.age;
    var email = req.body.email;
    var interests = req.body.interests;
    

    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const hashedPassword2 = crypto.pbkdf2Sync(password2, salt, 1000, 64, 'sha512').toString('hex'); 

    if (username && hashedPassword && hashedPassword2) {        
        db.query('SELECT * FROM 사용자 WHERE 아이디 = ?', [username], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && hashedPassword == hashedPassword2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                db.query('INSERT INTO 사용자 (아이디, 비밀번호, 이름, 성별, 나이, 이메일, 관심사) VALUES(?,?,?,?,?,?,?)', [username, hashedPassword, name, gender, age, email, interests], function (error, data) {
                    if (error) throw error;
                    res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                    document.location.href="/signup";</script>`);
                });
            } else if (hashedPassword != hashedPassword2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                res.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
                document.location.href="/signup";</script>`);    
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                res.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/signup";</script>`);    
            }            
        });

    } else {        // 입력되지 않은 정보가 있는 경우
        res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/signup";</script>`);
    }
};
exports.displaydeletePage = (req, res) => {
    res.render("delete");
};

exports.displayloginPage = (req, res) => {
    res.render("login");
}

exports.delete = (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const hashedPassword2 = crypto.pbkdf2Sync(password2, salt, 1000, 64, 'sha512').toString('hex');  

    if (username && hashedPassword && hashedPassword2) {
        if (hashedPassword !== hashedPassword2) {
            // 비밀번호가 올바르게 입력되지 않은 경우
            return res.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다.");
            document.location.href="/signup/deletePage";</script>`);
        }

        // DB에 같은 이름의 회원아이디가 있는지 확인
        db.query('SELECT * FROM 사용자 WHERE 아이디 = ?', [username], function(error, results, fields) {
            if (error) {
                console.error("Database query error: ", error);
                return res.status(500).send("Internal Server Error");
            }
            
            if (results.length === 0) {
                // DB에 같은 이름의 회원아이디가 없는 경우
                return res.send(`<script type="text/javascript">alert("존재하지 않는 아이디 입니다.");
                document.location.href="/signup/deletePage";</script>`);
            }

            var storedPassword = results[0].비밀번호; // 저장된 비밀번호
            
            // 입력된 비밀번호와 저장된 비밀번호가 일치하는지 확인
            if (storedPassword !== hashedPassword) {
                return res.send(`<script type="text/javascript">alert("비밀번호가 일치하지 않습니다.");
                document.location.href="/signup/deletePage";</script>`);
            }

            // 비밀번호가 일치하면 회원탈퇴 처리
            db.query('DELETE FROM 사용자 WHERE 아이디 = ?', [username], function(error, data) {
                if (error) {
                    console.error("Database query error: ", error);
                    return res.status(500).send("Internal Server Error");
                }

                res.send(`<script type="text/javascript">alert("회원탈퇴가 완료되었습니다!");
                document.location.href="/signup";</script>`);
            });
        });
    } else {
        // 입력되지 않은 정보가 있는 경우
        res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다.");
        document.location.href="/signup/deletePage";</script>`);
    }
}
