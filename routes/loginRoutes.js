const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.displayloginPage);
router.get('/', loginController.logout);
router.get('/signup', loginController.displaysignupPage);
router.post('/proc', loginController.login);


module.exports = router;


