//diaryController.js

const diaryModel = require('../models/diaryModel');
const friendModel = require('../models/friendModel');
const randModel = require('../models/randModel');

function renderForm(req, res) {
  const userId = req.session.member.회원번호;
  let randomUser = null;

  // 친구의 사용자 번호로부터 친구의 이름을 가져오는 함수 호출
  friendModel.getFriendInfo(userId, (err, friendInfo) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving friend list');
    }
    if (!friendInfo || friendInfo.length === 0) {
      friendInfo = []; // 친구가 없을 경우 빈 배열로 초기화
    }

    randModel.getUsersByUserIds([userId], (err, currentUser) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error retrieving user information');
      }

      const currentUserInterest = currentUser[0].관심사;

      randModel.getRandomUserBySameInterest(userId, (err, randomUserData) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error retrieving random user');
        }

        randomUser = randomUserData;

        res.render('form', { userId, currentUserInterest, randomUser, friendInfo });
      });
    });
  });
}

function handleGetForm(req, res) {
  console.log(req.query);
  res.send('get 요청 성공');
}

async function handlePostForm(req, res) {
  console.log(req.body);
  const { 수신자_번호, 일기_내용, 일기_작성일 } = req.body;
  const 작성자_번호 = req.session.member.회원번호;
  let 교환유형;

  console.log('작성자_번호:', 작성자_번호);
  console.log('수신자_번호:', 수신자_번호);

  try {
    // 작성자의 친구 목록 가져오기
    const friendInfo = await new Promise((resolve, reject) => {
      friendModel.getFriendInfo(작성자_번호, (err, friendInfo) => {
        if (err) {
          return reject(err);
        }
        resolve(friendInfo);
      });
    });

    console.log('Friend Info:', friendInfo); // 디버깅: 친구 목록 출력

    // 랜덤 사용자 가져오기
    const randomUser = await new Promise((resolve, reject) => {
      randModel.getRandomUserBySameInterest(작성자_번호, (err, randomUser) => {
        if (err) {
          return reject(err);
        }
        resolve(randomUser);
      });
    });

    console.log('Random User:', randomUser); // 디버깅: 랜덤 사용자 출력

    // 친구 목록에서 수신자_번호 확인
    const isFriend = friendInfo.some(friend => {
      console.log('Checking friend:', friend); // 디버깅: 친구 객체 출력
      return friend.회원번호 === parseInt(수신자_번호, 10);
    });

    console.log('Is Friend:', isFriend); // 디버깅: 친구 여부 출력

    // 수신자_번호에 따라 교환유형 설정
    if (parseInt(수신자_번호, 10) === 작성자_번호) {
      교환유형 = 0; // 나
    } else if (randomUser && parseInt(수신자_번호, 10) === randomUser.회원번호) {
      교환유형 = 2; // 랜덤 사용자
    } else if (isFriend) {
      교환유형 = 1; // 친구
    } else {
      교환유형 = 2; // 기본적으로 랜덤 사용자로 설정
    }

    console.log('Exchange Type:', 교환유형); // 디버깅: 교환유형 출력

    const diaryData = {
      작성자_번호,
      수신자_번호,
      일기_내용,
      일기_작성일,
      일기_송신일: new Date(),
      교환유형
    };

    diaryModel.createDiary(diaryData, 작성자_번호, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving data');
      } else {
        res.send("<script> alert('전송이 완료되었습니다.'); location.href='/';</script>"); 
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving data');
  }
}

async function renderReplyForm(req, res) {
  const userId = req.session.member.회원번호;
  const { exchange, exchangeType } = req.query;

  try {
    const exchangeTypeMap = { '나': 0, '친구': 1, '랜덤': 2 };
    const parsedExchangeType = exchangeTypeMap[exchangeType] || 2; // 기본값을 2로 설정

    res.render('replyForm', { userId, exchange, exchangeType: parsedExchangeType });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error rendering reply form');
  }
}


async function handleSendReply(req, res) {
  const { 작성자_번호, 수신자_번호, 일기_내용, 교환유형 } = req.body;

  try {
    const diaryData = {
      작성자_번호,
      수신자_번호,
      일기_내용,
      일기_작성일: new Date(),
      교환유형
    };

    await new Promise((resolve, reject) => {
      diaryModel.createDiary(diaryData, 작성자_번호, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.send("<script> alert('답장이 성공적으로 전송되었습니다.'); location.href='/';</script>");
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending reply');
  }
}

module.exports = {
  renderForm,
  handleGetForm,
  handlePostForm,
  renderReplyForm,
  handleSendReply,
};
