var async = require('async');
var mongoose = require('mongoose');

var profile = {
    name: { type: String },
    code: { type: String },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    pincode: String,
    landmark: String,
    address1: String,
    address2: String,
    address3: String,
    email: { type: String, default: '' },
    mobilenumber: String,
    dob: Date,
    picture: { type: String },
    specialtest: { type: Boolean },
    specialneed: { type: Boolean },
    pictureinfo: { type: mongoose.Schema.Types.Mixed },
    type: { type: String },
    expertise: { type: String },
    rating: Number,
    creditcardissued: String
};

var userSchema = new mongoose.Schema({
    username: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    profile: profile,
    _Deleted: { type: Boolean, default: false }
});
module.exports = mongoose.model('User', userSchema);
