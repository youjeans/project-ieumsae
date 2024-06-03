// controllers/listController.js
const db = require('../config/mysql'); // mysql.js에서 db 가져오기

const interestsMapping = {
    0: '스타/연예인',
    1: '스포츠',
    2: '문학/책',
    3: '영화/드라마',
    4: '반려동물',
    5: '요리',
    6: '여행',
    7: '건강/의학',
    8: '게임',
    9: '자기계발'
};

exports.getUserData = async (req, res) => {
    if (!req.session.member) {
        return res.redirect('/login'); // 세션에 member가 없으면 로그인 페이지로 리디렉션
    }

    const user_num = req.session.member.회원번호; // 로그인 세션의 회원번호 필드 사용

    try {
        // 첫 번째 쿼리: 사용자 테이블에서 user_num과 일치하는 아이디와 프로필 사진 경로 가져오기
        const [user] = await new Promise((resolve, reject) => {
            db.query(
                'SELECT 아이디, 프로필사진경로 FROM 사용자 WHERE 회원번호 = ?',
                [user_num],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

        const username = user?.아이디 || 'Unknown User';
        const profilePicPath = user?.프로필사진경로 || '/img/default-profile.png'; // 기본 프로필 사진 경로 설정

        // 두 번째 쿼리: 친구 테이블에서 친구_사용자_번호2 가져오기
        const friends = await new Promise((resolve, reject) => {
            db.query(
                'SELECT 친구_사용자_번호2 FROM 친구 WHERE 친구_사용자_번호1 = ?',
                [user_num],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

        // 친구_사용자_번호2 리스트
        const friendUserNumbers = friends.map(friend => friend.친구_사용자_번호2);

        // 세 번째 쿼리: 친구_사용자_번호2에 해당하는 사용자 테이블에서 아이디와 관심사 가져오기
        let idsAndInterests = [];
        if (friendUserNumbers.length > 0) {
            const users = await new Promise((resolve, reject) => {
                db.query(
                    'SELECT 회원번호, 아이디, 관심사, 프로필사진경로 FROM 사용자 WHERE 회원번호 IN (?)',
                    [friendUserNumbers],
                    (error, results) => {
                        if (error) return reject(error);
                        resolve(results);
                    }
                );
            });

            // 사용자 아이디와 관심사, 프로필 사진 경로 리스트
            idsAndInterests = users.map(user => ({
                id: user.아이디,
                interest: interestsMapping[user.관심사],
                profilePicPath: user.프로필사진경로 || '/img/default-profile.png' // 기본 프로필 사진 경로 설정
            }));
        }

        res.render('list', { user_num, username, profilePicPath, idsAndInterests });
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getUserPopup = async (req, res) => {
    const userId = req.query.userId; // URL 쿼리 매개변수에서 userId를 가져옵니다.
    
    try {
        const [user] = await new Promise((resolve, reject) => {
            db.query(
                'SELECT 아이디, 프로필사진경로 FROM 사용자 WHERE 아이디 = ?',
                [userId],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

        const username = user?.아이디 || 'Unknown User';
        const profilePicPath = user?.프로필사진경로 || '/img/default-profile.png'; // 기본 프로필 사진 경로 설정

        res.render('pop-up', { username, profilePicPath });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.checkUserId = async (req, res) => {
    const userId = req.query.userId; // URL 쿼리 매개변수에서 userId를 가져옵니다.
    
    try {
        const [user] = await new Promise((resolve, reject) => {
            db.query(
                'SELECT 아이디 FROM 사용자 WHERE 아이디 = ?',
                [userId],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

        if (user) {
            res.status(200).send({ exists: true });
        } else {
            res.status(404).send({ exists: false });
        }
    } catch (error) {
        console.error('Error checking user ID:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteFriend = async (req, res) => {
    const user1 = req.session.member.회원번호; // 세션의 회원번호 필드를 사용
    const friendId = req.body.friendId; // 삭제할 친구의 아이디

    try {
        // 먼저 friendId가 일치하는 사용자의 회원번호를 조회합니다.
        const [friend] = await new Promise((resolve, reject) => {
            db.query(
                'SELECT 회원번호 FROM 사용자 WHERE 아이디 = ?',
                [friendId],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

        if (!friend) {
            return res.status(404).send('존재하지 않는 사용자입니다.');
        }

        const user2 = friend.회원번호;

        const sqlDelete = `
            DELETE FROM 친구 
            WHERE (친구_사용자_번호1 = ? AND 친구_사용자_번호2 = ?) 
               OR (친구_사용자_번호1 = ? AND 친구_사용자_번호2 = ?)
        `;
        const valuesDelete = [user1, user2, user2, user1];

        db.query(sqlDelete, valuesDelete, (err, result) => {
            if (err) throw err;
            res.status(200).send('친구가 성공적으로 삭제되었습니다.');
        });
    } catch (error) {
        console.error('Error deleting friend:', error);
        res.status(500).send('Internal Server Error');
    }
};
