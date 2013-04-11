module.exports.index = function (req, res) {
    if (req.session.authed) {
        res.redirect('/dashboard');
    } else {
        res.render('index', {session: req.session});
    }
};

module.exports.dashboard = function (req, res) {

    if (req.session.authed) {
        res.render('dashboard', {session: req.session});
    }
    else {
        res.redirect('/');
    }
};

exports.account = function (req, res) {

    if (req.session.authed) {
        res.render('account', {session: req.session});
    }
    else {
        res.redirect('/');
    }
};


module.exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name, {session: req.session});
};