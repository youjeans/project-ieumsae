const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');

router.get('/', signupController.displayPage);
router.post('/register', signupController.signup);

module.exports = router;