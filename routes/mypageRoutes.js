const express = require('express');
const router = express.Router();
const mypageController = require('../controllers/mypageController');

router.get('/', mypageController.displaymyPage);
router.get('/deletePage', mypageController.displaydeletePage);
router.get('/pwUpdatePage', mypageController.displayPWupdatePage);
router.post('/change-pw', mypageController.changePW);
// 프로필 사진 업로드 라우트 추가
router.post('/uploadProfilePic', mypageController.upload.single('profilePic'), mypageController.uploadProfilePic);


module.exports = router;
