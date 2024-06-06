const session = require('express-session');
const database = require('../config/mysql');
const transResult = require('../models/transResultModel');

// 나와의 일기 페이지를 보여준다.
exports.displayMy = (req, res) => {
    // 로그인 중인지, 회원번호 접근 가능한지 확인
    if (!req.session.member || !req.session.member.회원번호) {
        return res.status(401).send("<script> alert('로그인이 필요합니다.'); location.href = '/login';</script>");
    }
    const query = 'SELECT 일기_송신일, 일기_내용 FROM 일기 WHERE 교환유형 = 0 AND 작성자_번호 = ? AND d.일기_송신일 < NOW()';
    const values = [req.session.member.회원번호];
    database.query(query, values, (err, result) => {
        const transResultData = [];
        if (result && result.length > 0) {
            transResultData = transResult(result);
        }
        res.render('diaryMy', {result: transResultData});
    });
};

// 일기 페이지를 보여준다.
exports.displayPage = (req, res) => {
    // 로그인 중인지, 회원번호 접근 가능한지 확인
    if (!req.session.member || !req.session.member.회원번호) {
        return res.status(401).send("<script> alert('로그인이 필요합니다.'); location.href = '/login';</script>");
    }

    const exchange = parseInt(req.params.exchange, 10); // params는 문자열로 받음 -> int로 변환
    if (isNaN(exchange)) {
        console.error('params 로 받은 exchange 에 문제 발생: ', req.params.exchange);
        return res.status(400).send('Invalid exchange');
    }

    const query = 'SELECT u.이름 AS 작성자_이름, d.일기_내용, d.일기_송신일, d.교환유형 FROM 일기 d JOIN 사용자 u ON d.작성자_번호 = u.회원번호 WHERE ((d.수신자_번호 = ? AND d.작성자_번호 = ?) AND d.일기_송신일 < NOW()) OR ((d.작성자_번호 = ? AND d.수신자_번호 = ?)) ORDER BY 일기_송신일 DESC'; //  
    const values = [req.session.member.회원번호, exchange, req.session.member.회원번호, exchange];
    database.query(query, values, (err, result) => {
        if (err) {
            console.log('! diaryPageController.js 파일의 displayPage 함수에서 query 에러 발생함: ', err);
            return;
        }
        const transResultData = transResult(result);
        res.render('diaryPage', { result: transResultData });
    });
};
