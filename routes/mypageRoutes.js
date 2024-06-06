const express = require('express');
const router = express.Router();
const mypageController = require('../controllers/mypageController');

router.get('/', mypageController.displaymyPage);
router.get('/deletePage', mypageController.displaydeletePage);
router.get('/pwUpdatePage', mypageController.displayPWupdatePage);
router.post('/change-pw', mypageController.changePW);


module.exports = router;
