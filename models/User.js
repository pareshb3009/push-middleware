var async = require('async');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    user_id: { type: String, unique: true },
    appid: { type: String }
});
module.exports = mongoose.model('User', userSchema);
