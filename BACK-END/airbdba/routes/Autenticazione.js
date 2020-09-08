var express = require('express');
var router = express.Router();
const LoginControl = require('../controller/LoginControl');
const LogoutControl = require('../controller/LogoutControl');
const JwtToken = require('../utils/JwtToken');
/* GET users listing. */

//TO-DO
//router.get('/test', LoginControl.login_get);

router.post('/login', LoginControl.login_post);
router.get('/logout', [JwtToken.verifyToken],LogoutControl.logout_get);
//router.get('/logout', logout) 

module.exports = router;
