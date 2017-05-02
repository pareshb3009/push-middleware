var secrets = require('./secrets');
exports.isAuthenticated = function(req, res, next) {
    if(!req.query.apikey)
        return next(new Error("apikey missing"))

    if(req.query.apikey != secrets.apiSecret)
        return next(new Error("apikey mis match"))

    return next()
};
