const database = require('../config/mysql');

exports.displaySample = (req, res) => {
    const data = 'display Sample';
    res.render('diarySample', { data });
};

exports.displayPage = (req, res) => {
    const exchange = parseInt(req.params.exchange, 10); // params는 문자열로 받음 -> int로 변환
    if (isNaN(exchange)) {
        console.error('params 로 받은 exchange 에 문제 발생: ', req.params.exchange);
        return res.status(400).send('Invalid exchange');
    }

    const query = 'SELECT 작성자_번호, 일기_내용, 일기_송신일, 교환유형 FROM 일기 WHERE (수신자_번호 = ? AND 작성자_번호 = ?) OR (작성자_번호 = ? AND 수신자_번호 = ?) AND 일기_송신일 < NOW() ORDER BY 일기_송신일 DESC';
    const values = [4, exchange, 4, exchange]; // 임시적으로 설정
    // const values = [session.member.회원번호, exchange, session.member.회원번호, exchange];
    database.query(query, values, (err, result) => {
        if (err) {
            console.log('! diaryPageController.js 파일의 displayPage 함수에서 query 에러 발생함: ', err);
            return;
        }
        res.render('diaryPage', { result });
    });
};

