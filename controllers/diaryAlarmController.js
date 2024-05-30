const session = require('express-session');
const database = require('../config/mysql');
const transResult = require('./transResult');

// 알람 페이지를 보여준다. 조회수가 0인 데이터만 노출된다.
exports.displayAlarm = (req, res) => {
    // 로그인 중인지, 회원번호 접근 가능한지 확인
    if (!req.session.member || !req.session.member.회원번호) {
        return res.status(401).send("<script> alert('로그인이 필요합니다.'); location.href = '/login';</script>");
    }
    
    const query = 'SELECT e.교환기록_번호, u.이름 AS 송신자_이름, e.수신일시 FROM 일기교환기록 e JOIN 사용자 u ON e.송신자_번호 = u.회원번호 WHERE e.조회여부 = 0 AND e.수신자_번호 = ? AND e.수신일시 < NOW() ORDER BY e.수신일시 DESC ';
    //const value = [4];
    const value = [req.session.member.회원번호];
    database.query(query, value, (err, result) => {
        if (err) {
            console.log('diaryAlarmController.js 의 displayAlarm 함수의 query에 에러 발생: ', err);
            return;
        }
        const transResultDate = transResult(result);
        res.render('diaryAlarm', {result: transResultDate});
    });
};

// 알람 페이지와 연결된 일기 페이지를 보여준다. 클릭하면 조회수가 증가한다.
exports.displayPageId = (req, res) => {
    const pageId = parseInt(req.params.pageId, 10); // params를 INT으로 받는다.

    // 교환기록 번호로 꺼낸 조회여부에 1을 더한다.
    const query = 'UPDATE 일기교환기록 SET 조회여부 = 조회여부 + 1 WHERE 교환기록_번호 = ?';
    const value = [pageId];
    database.query(query, value, (err, result) => {
        if (err) {
            console.error('일기교환기록 조회여부 증가 에러:', err);
            return;
        }
        console.log('일기교환기록 조회여부가 성공적으로 증가되었습니다.');
    });

    const query2 = 'SELECT u.이름 AS 작성자_이름, d.일기_내용, d.일기_송신일, d.교환유형 FROM 일기 d JOIN 사용자 u ON u.회원번호 = d.작성자_번호 WHERE d.일기_번호 = ?';
    database.query(query2, value, (err, result) => {
        if (err) {
            console.error('diaryAlarmController.js 의 displayPageId 함수의 query에 에러 발생: ', err);
            return;
        }
        const transResultDate = transResult(result);
        res.render('diaryPageId', {result: transResultDate});
    });
};

