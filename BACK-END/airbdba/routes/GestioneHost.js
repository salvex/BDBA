var express = require('express');
var router = express.Router();
const JwtToken = require('../utils/JwtToken');
const HostControl = require('../controller/HostControl');


router.get('/become', [JwtToken.verifyToken], HostControl.become_host_post);

module.exports = router;
