var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', description: 'Express description' });
});

router.get('/a', function(req, res, next) {
    res.send("Tutorial on A");
});
router.get('/b', function(req, res, next) {
    res.send("Tutorial on B");
});

module.exports = router;