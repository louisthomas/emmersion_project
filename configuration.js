module.exports.configure = function (app, express) {

    // optional modules
    app.use(express.logger());
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // cookies
    app.use(express.cookieParser('SECRET_HASH_12d9cjmdsnansdasj4gbneb122eb1!"/$!||_SECRET_HASH'));
    app.use(express.cookieSession());

    // views
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options', {
        layout: false,
        pretty: true
    });

    // routing
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
};