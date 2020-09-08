var express = require('express');
var router = express.Router();
const RegControl = require('../controller/RegControl.js');

router.get('/', RegControl.registrazione_get);

router.post('/registrazione', RegControl.registrazione_post);
 
module.exports = router;
