var express = require('express');
var router = express.Router();
const LoginControl = require('../controller/LoginControl');
/* GET users listing. */

//TO-DO
router.get('/', (req,res) => {
  //qualcosa
})

router.post('/login', LoginControl.login)
//router.get('/logout', logout) 

module.exports = router;
