const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');

router.get('/', (req, res) => {
  res.send('Diary Home');
});

router.get('/form', diaryController.renderForm);
router.get('/getform', diaryController.handleGetForm);
router.post('/postform', diaryController.handlePostForm);
router.get('/reply', diaryController.renderReplyForm);
router.post('/sendReply', diaryController.handleSendReply);



module.exports = router;
