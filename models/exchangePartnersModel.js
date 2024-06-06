const database = require('../config/mysql');

exports.getExchangeInfo = (req, res, next) => {
    // 로그인 중인지, 회원번호 접근 가능한지 확인
    if (!req.session.member || !req.session.member.회원번호) {
        return res.status(401).send("<script> alert('로그인이 필요합니다.'); location.href = '/login';</script>");
    }

    const userId = req.session.member.회원번호;
    const exchangePartnersQuery = 'SELECT 작성자_번호, 수신자_번호, u1.이름 AS 작성자_이름, u2.이름 AS 수신자_이름 FROM 일기 JOIN 사용자 u1 ON 일기.작성자_번호 = u1.회원번호 JOIN 사용자 u2 ON 일기.수신자_번호 = u2.회원번호 WHERE 작성자_번호 = ? OR (수신자_번호 = ? AND 일기_송신일 < NOW())';
    const exchangePartnersValues = [userId, userId];
    
    const exchangeCountQuery = 'SELECT COUNT(*) AS count FROM 일기교환기록 WHERE 조회여부 = 0 AND 수신자_번호 = ? AND 수신일시 < NOW()';
    const exchangeCountValues = [userId];

    database.query(exchangePartnersQuery, exchangePartnersValues, (err, partnersResult) => {
        if (err) {
            console.error('getExchangeInfo: Error querying exchange partners:', err);
            return next(err);
        }

        const exchangePartners = new Set();
        const partnerIds = new Set();

        partnersResult.forEach(partner => {
            if (partner.작성자_번호 !== userId && !partnerIds.has(partner.작성자_번호)) {
                exchangePartners.add({회원번호: partner.작성자_번호, 이름: partner.작성자_이름});
                partnerIds.add(partner.작성자_번호);
            }
            if (partner.수신자_번호 !== userId && !partnerIds.has(partner.수신자_번호)) {
                exchangePartners.add({회원번호: partner.수신자_번호, 이름: partner.수신자_이름});
                partnerIds.add(partner.수신자_번호);
            }
        });

        req.exchangePartners = Array.from(exchangePartners);
        req.myname = req.session.member.이름;

        // exchangeCount 쿼리 실행
        database.query(exchangeCountQuery, exchangeCountValues, (err, countResult) => {
            if (err) {
                console.error('getExchangeInfo: Error querying exchange count:', err);
                return next(err);
            }

            req.count = countResult[0].count;
            next();
        });
    });
};
