var express = require('express');
var router = express.Router();
const RicercaControl = require('../controller/RicercaControl');

router.get('/', (req, res, next) => {
  //qualcosa
});

router.get('/results', RicercaControl.ricerca_get );



module.exports = router;
