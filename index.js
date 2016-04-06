//Express
var express = require('express');
var app = express();
var cons = require('consolidate');
var http = require('http');

//passport
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//Express Middleware
var bodyParser = require('body-parser');

//Include Mongoose
var mongoose = require('mongoose');
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOLAB_URL ||
'mongolab://localhost/project-aardvark';


mongoose.connect(uristring, function(err){

  if(err) {

  	console.log('error connecting to: ' , uristring);

  }
});

//Allow CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, Accept');
    next();
});

//Express settings
app.set ('port', (process.env.PORT || 8081 ));
app.engine('html', cons.liquid);

app.set('views', './views');
app.set('view engine', 'html');


//Express Middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//Include routes
var moviesRoutes = require('./routes/movies');
var usersRoutes = require('./routes/user')
var index1Route = require ('./routes/index')
app.use(moviesRoutes);
app.use(usersRoutes);
app.use(index1Route);

// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// console.log(routes);
app.listen(app.get('port'), function() {
    console.log('server running on http://127.0.0.1:%s', app.get('port'));
});
