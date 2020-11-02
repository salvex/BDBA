var express = require("express");
var router = express.Router();
var moment = require("moment");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("schermataPrincipale");
});

module.exports = router;
