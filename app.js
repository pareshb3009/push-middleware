var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cors = require('cors');
var methodOverride = require('method-override');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectDomain = require('connect-domain');
var addRequestId = require('express-request-id')();

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');
var routes = require('./routes/index');

var app = express();
app.use(cors());
app.use(connectDomain());

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
})

/**
 * Express configuration.
 */
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(expressValidator());
app.use(methodOverride());

app.use(passport.initialize());
app.use(addRequestId);

/* authenticated access */
app.use(passportConf.isAuthenticated);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err,
            stack: err.stack
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});
module.exports = app;
