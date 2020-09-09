var express = require('express');
var router = express.Router();
const RicercaControl = require('../controller/RicercaControl');

router.get('/', (req, res, next) => {
  //qualcosa
});

router.post('/results', RicercaControl.ricerca_post );



module.exports = router;
