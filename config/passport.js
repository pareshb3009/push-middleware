var secrets = require('./secrets');
exports.isAuthenticated = function(req, res, next) {
    if(!req.header.apikey)
        return next(new Error("apikey missing"))

    if(req.header.apikey != secrets.apiSecret)
        return next(new Error("apikey mis match"))
        
    if(req.header.apikey == secrets.apiSecret)
        return next()
};
