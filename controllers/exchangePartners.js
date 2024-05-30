const database = require('../config/mysql');

exports.getExchangePartners = (req, res, next) => {
    // 로그인 중인지, 회원번호 접근 가능한지 확인
    if (!req.session.member || !req.session.member.회원번호) {
        return res.status(401).send("<script> alert('로그인이 필요합니다.'); location.href = '/login';</script>");
    }

    const userId = req.session.member.회원번호
    const query = 'SELECT 작성자_번호, 수신자_번호, u1.이름 AS 작성자_이름, u2.이름 AS 수신자_이름 FROM 일기 JOIN 사용자 u1 ON 일기.작성자_번호 = u1.회원번호 JOIN 사용자 u2 ON 일기.수신자_번호 = u2.회원번호 WHERE (작성자_번호 = ? OR 수신자_번호 = ?) AND 일기_송신일 < NOW()';
    const values = [userId, userId];
    database.query(query, values, (err, result) => {
        if (err) {
            console.error('getExchangePartners in query error: ', err);
            return next(err);
        }
        const exchangePartners = new Set();

        result.forEach(partner => {
            if (partner.작성자_번호 !== userId) {
                exchangePartners.add({회원번호: partner.작성자_번호, 이름: partner.작성자_이름});
            }
            if (partner.수신자_번호 !== userId) {
                exchangePartners.add({회원번호: partner.수신자_번호, 이름: partner.수신자_이름});
            }
        });
        
        req.exchangePartners = Array.from(exchangePartners);
        next();
    })
    
};