var express = require('express');
var router = express.Router();
var diaryController = require('../controllers/diaryController');

router.post('/getinfo', diaryController.renderForm);
router.post('/confirm', diaryController.handleGetForm);
router.post('/set', diaryController.handlePostForm);

module.exports = router;
