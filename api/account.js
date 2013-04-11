var db = require('../database.js');


exports.login = function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    db.User.findOne({'email': email, 'password': password}).populate('friends').exec(function (error, user) {
            if (!error && user != null && user.email == email) {
                // set connected
                user.last_time_connect = new Date();
                user.connect_state = true;
                if (user.friends === null) {
                    user.friends = [];
                }
                user.save();
                // configure session
                req.session.authed = true;
                req.session.user = user;
                // return result
                res.json({"error": 0, "status": "Ok"});
            } else {
                res.json({"error": 1, "status": "Invalid username or password"});
            }
        }
    );

};

exports.loginfacebook = function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    db.User.findOne({'email': email, 'password': password}).exec(function (error, user) {
            if (!error && user != null && user.email == email) {
                // set connected
                user.last_time_connect = new Date();
                user.connect_state = true;
                user.save();
                // configure session
                req.session.authed = true;
                req.session.user = user;
                // return result
                res.json({"error": 0, "status": "Ok"});
            } else {
                res.json({"error": 1, "status": "Invalid username or password"});
            }
        }
    );
};

exports.logout = function (req, res) {
    if (req.session) {
        req.session.authed = false;
        db.User.findOne({'_id': req.session.user._id}).exec(function (error, myself) {
            if (!error && myself) {
                myself.connect_state = false;
                myself.save();
            }
        });
        req.session.user = null;
    }
    res.redirect('/');
};


exports.create = function (req, res) {

    var user = req.body;
    console.log("Adding user:" + JSON.stringify(user));

    var u = new db.User();
    u.name.first = req.body.first_name;
    u.name.last = req.body.last_name;
    u.email = req.body.email;
    u.password = req.body.password;
    u.location = req.body.location;
    u.date_created = new Date();
    u.last_time_connect = new Date();
    u.friends = [];
    u.interests = []
    u.connect_state = true;

    u.save(function (err, data) {
        if (err) {
            var result = { "error": 1, "status": "Invalid data or email exists already."};
            res.json(201, result);
        } else {
            console.log('Success: ' + JSON.stringify(data._id));
            req.session.authed = true;
            //id generate
            req.session.user = u;
            res.json({"error": 0, "status": "Ok"});
        }
    });
};

exports.update = function (req, res) {

    db.User.findOne({'_id': req.session.user._id}).exec(function (error, user) {
        if (!error && user) {

            var data = req.body;

            // update general info
            user.name.first = data.first_name;
            user.name.last = data.last_name;
            user.email = data.email;
            user.location = data.location_country;

            // update password if not empty
            if (data.password && data.password.length > 0) {
                user.password = data.password;
            }

            user.save();

            res.redirect('/dashboard');
        } else {
            // invalid session
            res.redirect('/');
        }
    });
};

exports.delete = function (req, res) {
    res.json({"error": 0, "status": "Ok"});
};

