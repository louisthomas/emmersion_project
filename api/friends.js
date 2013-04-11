var db = require('../database.js');

exports.list = function (req, res) {

};

exports.add = function (req, res) {
    var email = req.body.adduser_email;
    if (email) {
        db.User.findOne({'email': email}).exec(function (error, user) {
            if (!error && user != null && user.email == email) {
                db.User.findOne({'_id': req.session.user._id}).exec(function (error, myself) {
                    if (user._id.id != myself._id.id) {
                        myself.friends.push(user);
                        myself.save(function (error) {
                            if (!error) {
                                res.send(user.name.first + ' ' + user.name.last + ' was added to your friends list.');
                            } else {
                                res.send('Error, the user could not be found.');
                            }
                        });
                    } else {
                        res.send('Error, you can\'t add yourself to your own friend list.');
                    }
                });
            }
        });
    }
};

exports.delete = function (req, res) {
    var id = req.body.user_id;
    if (id) {
        db.User.findOne({'_id': id}).exec(function (error, user) {
            if (!error && user != null && user._id == id) {
                db.User.findOne({'_id': req.session.user._id}).exec(function (error, myself) {
                    myself.friends.remove(user);
                    myself.save(function (error) {
                        if (!error) {
                            res.send(user.name.first + ' ' + user.name.last + ' was removed from your friends list.');
                        } else {
                            res.send('Error, the user could not be found.');
                        }
                    });
                });
            }
        });
    }
};

exports.search = function (req, res) {

    var firstName = req.body.first_name.trim();
    var lastName = req.body.last_name..trim();
    var email = req.body.email.trim();

    // Search for people using parameters...
    var filter = {};

    if (firstName.length > 0) {
        filter.first_name = new RegExp(firstName);
    }

    if (lastName.length > 0) {
        filter.last_name = new RegExp(lastName);
    }

    if (email.length > 0) {
        filter.email = new RegExp(email);
    }

    db.User.find(filter, function (err, result) {
        if (!err && result) {
            res.json(result);
        }
    });
};
