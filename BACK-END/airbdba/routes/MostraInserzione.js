var express = require('express');
var router = express.Router();
const ShowInsControl = require('../controller/ShowInsControl');

/* GET home page. */
router.get('/res', ShowInsControl.mostra_get);

module.exports = router;
