var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.render("signInUp", { layout: false });
});

module.exports = router;
