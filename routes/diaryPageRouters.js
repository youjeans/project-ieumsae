const express = require('express');
const router = express.Router();
const diaryPageController = require('../controllers/diaryPageController');

// URL 파라미터 사용
router.get('/', diaryPageController.displaySample);
router.get('/:exchange', diaryPageController.displayPage);
router.get('/mine', diaryPageController.displayMine);

module.exports = router;