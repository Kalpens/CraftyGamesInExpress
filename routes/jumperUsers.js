var express = require('express');
var router = express.Router();


router.get('/jumperuserlist', function(req, res) {
    var db = req.db;
    var collection = db.get('JumperScores');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/* POST to Add Album Service */
router.post('/addjumperuser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.userName;
    var score = req.body.score;

    // Set our collection
    var collection = db.get('JumperScores');
    // Submit to the DB
    collection.insert({
        "username" : userName,
        "score" : score
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
    });
});
module.exports = router;
