const express = require('express');
const router = express.Router();
const diaryAlarmController = require('../controllers/diaryAlarmController');

router.get('/',diaryAlarmController.displayAlarm);
router.get('/:pageId', diaryAlarmController.displayPageId); 

module.exports = router;