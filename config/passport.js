var secrets = require('./secrets');
exports.isAuthenticated = function(req, res, next) {
    if(!req.headers.apikey)
        return next(new Error("apikey missing"))

    if(req.headers.apikey != secrets.apiSecret)
        return next(new Error("apikey mis match"))
        
    if(req.headers.apikey == secrets.apiSecret)
        return next()
};
