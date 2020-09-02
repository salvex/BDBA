var express = require('express');
var router = express.Router();
const RegControl = require('../controller/RegControl.js');

router.get('/', (req,res) => {
  //qualcosa
});

router.post('/registrazione', RegControl.registrazione);
 
module.exports = router;
