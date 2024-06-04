// routes/listRoutes.js
const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController'); // listController 가져오기

// 기본 라우트
router.get('/', listController.getUserData);
// pop-up 라우트 설정
router.get('/pop-up', listController.getUserPopup);
// 아이디 확인 경로 추가
router.get('/check-user-id', listController.checkUserId); 
// 친구 삭제 경로 추가
router.post('/delete-friend', listController.deleteFriend); 


module.exports = router;
