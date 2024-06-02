const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');

router.get('/', signupController.displaysignupPage);
router.post('/register', signupController.signup);
router.get('/deletePage', signupController.displaydeletePage);
router.post('/delete', signupController.delete);
router.get('/login', signupController.displayloginPage);

module.exports = router;