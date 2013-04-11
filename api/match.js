var db = require('../database.js');


exports.match = function (req, res) {

    var searchRequest = req.body;

    console.log("Search request:" + JSON.stringify(searchRequest));

    console.log("Interests: " + req.body.interests.length);
    console.log("Language: " + req.body.language);
    console.log("Skill: " + req.body.skill);

    //
    res.json({"error": 0, "status": "Ok"});
};