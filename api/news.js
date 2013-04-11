var db = require('../database.js');

exports.list = function (req, res) {

};

exports.post = function (req, res) {
    var data = req.body;
    if (data.input && data.input.length) {
        var news = new db.News();
        news.owner = req.session.user._id;
        news.message = data.input;
        news.timestamp = new Date();
        news.save();
        res.json({error: 0, message: 'OK'});
    } else {
        res.json({error: 1, message: 'Input empty'});
    }
};

