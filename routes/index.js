var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

/* GET game1 page. */
router.get('/gamejumper', function(req, res, next) {
    res.render('gamejumper', {});
});

module.exports = router;
