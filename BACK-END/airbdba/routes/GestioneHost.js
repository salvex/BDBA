var express = require('express');
var router = express.Router();
const JwtToken = require('../utils/JwtToken');
const HostControl = require('../controller/HostControl');

//router.get('/', [JwtToken.verifyToken,JwtToken.verifyHost], HostControl.visualizza_ins_get);
router.get('/become', [JwtToken.verifyToken], HostControl.become_host_get);
router.post('/crea_ins', [JwtToken.verifyToken],[JwtToken.verifyHost], HostControl.aggiungi_inserzione_post);
router.get('/', [JwtToken.verifyToken], [JwtToken.verifyHost], HostControl.visualizza_inserzioni_get);


module.exports = router;
