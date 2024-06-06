const db = require('../config/mysql');

exports.addFriend = (req, res) => {
    const user1 = req.session.member.회원번호; // 세션의 회원번호 필드를 사용
    const user2Id = req.body.친구_사용자_아이디;

    if (!user2Id) {
        return res.status(400).send("아이디를 입력해주세요.");
    }

    // 입력된 아이디로 회원번호를 조회
    const sqlFindUser = 'SELECT 회원번호 FROM 사용자 WHERE 아이디 = ?';
    db.query(sqlFindUser, [user2Id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(404).send("존재하지 않는 아이디입니다.");
        }

        const user2 = results[0].회원번호;

        if (user1 === user2) {
            return res.status(400).send("자기 자신을 친구로 추가할 수 없습니다.");
        }

        const sqlCheck = 'SELECT * FROM 친구 WHERE (친구_사용자_번호1 = ? AND 친구_사용자_번호2 = ?)';
        const valuesCheck = [user1, user2];

        db.query(sqlCheck, valuesCheck, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                return res.status(400).send("이미 친구로 추가된 사용자입니다.");
            } else {
                const sqlInsert = 'INSERT INTO 친구 (친구_사용자_번호1, 친구_사용자_번호2, 친구추가일) VALUES (?, ?, NOW())';
                const valuesInsert = [user1, user2];
        
                db.query(sqlInsert, valuesInsert, (err, result) => {
                    if (err) throw err;
                    res.status(200).send("친구가 성공적으로 추가되었습니다.");
                });
            }
        });
    });
};
