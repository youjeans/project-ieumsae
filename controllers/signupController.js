var db = require('../config/mysql');

exports.displayPage = (req, res) => {
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
    
    if (username && password && password2) {        
        db.query('SELECT * FROM 사용자 WHERE 아이디 = ?', [username], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                db.query('INSERT INTO 사용자 (아이디, 비밀번호, 이름, 성별, 나이, 이메일, 관심사) VALUES(?,?,?,?,?,?,?)', [username, password, name, gender, age, email, interests], function (error, data) {
                    if (error) throw error;
                    res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                    document.location.href="/";</script>`);
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                res.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
                document.location.href="/auth/register";</script>`);    
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                res.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/auth/register";</script>`);    
            }            
        });

    } else {        // 입력되지 않은 정보가 있는 경우
        res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/auth/register";</script>`);
    }
};