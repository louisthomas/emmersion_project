/**
 * LOG350 Node Js Server
 */
console.log('--- startup ---');
var db = require('./database.js');
var api = require('./api');
var routes = require('./routes');
var configuration = require('./configuration.js');
var express = require('express');
var app = express();

// setup
configuration.configure(app, express);

// global controller, executed for all requests
app.all('*', function (req, res, next) {
    // allow browser to decode json even when not sent from same domain
    res.set({'Access-Control-Allow-Origin': '*'});

    // update session user
    if (!/^\/admin\/.*/.test(req.path) && req.session.authed && req.session.user) {
        db.User.findOne({'_id': req.session.user._id}).populate('friends').exec(function (error, user) {
            if (error) console.log(error);
            if (user) {
                req.session.user = user;
                // filter by owner ids
                var owners = [];
                // add my friends
                for (var i = 0; i < user.friends.length; i++) {
                    owners.push(user.friends[i]._id);
                }
                // add myself!
                owners.push(user._id);
                // update news feed
                db.News.find().where('owner').in(owners).populate('owner').sort({'timestamp': 'desc'}).exec(function (error, news) {
                    if (error) console.log(error);
                    if (news) {
                        req.session.news = news;
                    }
                    // http://expressjs.com/guide.html#passing-route control
                    next();
                });
            } else {
                // invalid user?
                api.account.logout(req, res);
            }
        });
    } else {
        next();
    }
});

/***********************************************
 * Account Functions.
 ***********************************************/
app.post('/api/account/login', api.account.login);
app.post('/api/account/loginfacebook', api.account.loginfacebook);
app.get('/api/account/logout', api.account.logout);
app.post('/api/account/create', api.account.create);
app.post('/api/account/update', api.account.update);
app.post('/api/account/delete', api.account.delete);

/***********************************************
 * Friends Functions.
 ***********************************************/
app.post('/api/friends/list', api.friends.list);
app.post('/api/friends/add', api.friends.add);
app.post('/api/friends/delete', api.friends.delete);
app.post('/api/friends/search', api.friends.search);

/***********************************************
 * News Feed Functions.
 ***********************************************/
app.post('/api/news/post', api.news.post);
app.post('/api/news/list', api.news.list);

/***********************************************
 * Matchmaking Functions.
 ***********************************************/
app.post('/api/match', api.match.match);


/******************************
 * Test functions
 *****************************/
app.get('/admin/user/search', function (req, res) {
    var param = null;
    var q = db.regex_quote(req.query.q);
    if (q) {
        param = {$or: [
            {'email': {'$regex': q}},
            {'name.first': {'$regex': q}},
            {'name.last': {'$regex': q}}
        ]}
    }
    db.User.find(param).exec(function (err, users) {
        res.json(users);
    });
});

app.post('/admin/user/create', function (req, res) {
    var u = new db.User();
    u.name.first = req.body.firstname;
    u.name.last = req.body.lastname;
    u.email = req.body.email;
    u.password = req.body.password;
    u.location = req.body.location;
    u.language = req.body.language;
    u.friends = [];
    u.interests = [];
    u.date_created = new Date();
    u.save();
    res.json(u._id);
});

app.post('/admin/user/delete', function (req, res) {
    db.User.remove({_id: req.body.id}).exec(function (error, product) {
        if (!error && product) {
            res.json(true);
        } else {
            console.log(error);
            res.json(false);
        }
    });
});

// route views
app.get('/dashboard', routes.dashboard);
app.get('/account', routes.account);
app.get('/partials/:name', routes.partials);
app.get('*', routes.index);

console.log('--- ready ---');

// use port given through command line parameters or 3000
var port = process.env.PORT || 3000;

// start listening
app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});