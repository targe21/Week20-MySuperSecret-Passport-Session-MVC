const express = require('express');
const mainController = require('../controllers/mainController');
const router = express.Router();

router.get('/', mainController.getMainPage);
router.get('/register', mainController.getRegisterPage);
router.post('/register', mainController.postRegister);
router.get('/login', mainController.getLoginPage);
router.post('/login', mainController.postLogin);
router.get('/secrets', mainController.getSecretsPage); 
router.get('/submit', mainController.getSubmitSecret);
router.post('/submit', mainController.postSecret);
router.get('/logout', mainController.userLogout);


module.exports = router;