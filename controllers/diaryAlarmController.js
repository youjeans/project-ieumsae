const session = require('express-session');
const database = require('../config/mysql');

exports.displayAlarm = (req, res) => {
    const query = 'SELECT 교환기록_번호, 송신자_번호, 수신일시 FROM 일기교환기록 WHERE 조회여부 = 0 AND 수신자_번호 = ? AND 수신일시 < NOW() ORDER BY 수신일시 DESC ';
    const value = [4];
    //const value = [session.member.회원번호];
    database.query(query, value, (err, result) => {
        if (err) {
            console.log('diaryAlarmController.js 의 displayAlarm 함수의 query에 에러 발생: ', err);
            return;
        }
        res.render('diaryAlarm', {result});
    });
};

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

    const query2 = 'SELECT 작성자_번호, 일기_내용, 일기_송신일, 교환유형 FROM 일기 WHERE 일기_번호 = ?';
        database.query(query2, value, (err, result) => {
            if (err) {
                console.error('diaryAlarmController.js 의 displayPageId 함수의 query에 에러 발생: ', err);
                return;
            }
            res.render('diaryPageId', {result});
        });
};

