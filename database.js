var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@linus.mongohq.com:10079/app14400195');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('database connection successful');
});

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    name: {first: String, last: String},
    location: String,
    language: String,
    interests: Array,
    friends: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    connect_state: Boolean,
    last_time_connect: Date,
    date_created: Date,
    level_skill: Number
});

var roomSchema = mongoose.Schema({
    owner: String,
    invite: String,
    reserve: Boolean,
    language: String,
    level_skill: Number,
    interests: Array
});

var conversationSchema = mongoose.Schema({
    owner: String,
    invite: String,
    date: Date,
    duration: Number,
    rating: Number
});

var newsSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: Date
})

module.exports.User = mongoose.model('User', userSchema);
module.exports.Room = mongoose.model('Room', roomSchema);
module.exports.News = mongoose.model('News', newsSchema);
module.exports.Conversation = mongoose.model('Conversation', conversationSchema);

module.exports.regex_quote = function (str) {
    return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

