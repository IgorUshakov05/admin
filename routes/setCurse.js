var express = require('express');
var router = express.Router();

/* GET home page. */
router.use(function(req, res, next) {
    console.log(req.body.curse)
    res.json({curse: req.body.curse})
});

module.exports = router;
