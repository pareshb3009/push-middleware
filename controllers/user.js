var async = require('async');
var Model = require('../models/User');
var request = require('request');
var TimeZone = require('../config/secrets').timezone;
var moment = require('moment-timezone');
var mongoose = require('mongoose');
var secrets = require('../config/secrets');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

exports.register = function(req, res, callback) {
    var data =req.body
    var url = secrets.resonatorHost,
        userid = data.user_id,
        device = data.device,
        deviceid = {
            "appid":data.appid,
            "code":data.device_id,
        }

    async.waterfall([
        function(nextfunc) {
            //check if user exist?
            var postData = {
                _id: userid,
                "devices": {
                    "sms": (mobilenumber)?[mobilenumber]:[],
                    "email": [],
                    "phone": [],
                    "apn": (device == 'ios') ? [deviceid] : [],
                    "gcm": (device == 'android') ? [deviceid] : []
                },
                "channels": []
            }
            var options = {
                uri: url + '/api/identity',
                headers: { 'x-user-id': userid },
                method: 'GET'
            };
            request(options, function(err, httpResponse, body) {
                if (!err && httpResponse.statusCode == 200) {
                    //update the deviceid.
                    if(body){
                    	//update the deviceid.
                    	try {
                  			body = JSON.parse(body);
                  			postData.devices = body.devices;
                  			if(device =='ios')
                  				postData.devices.apn = [deviceid];
                  			else if(device == 'android')
                  				postData.devices.gcm = [deviceid];
                  		} catch(e) {
                  			console.log(e);
                  		}
                  	}
                    var putOptions = {
                        uri: url + '/api/identity',
                        headers: { 'x-user-id': userid },
                        method: 'PUT',
                        json: postData
                    }
                    request(putOptions, function(err, postResponse, body) {
                        return nextfunc(err, postResponse)
                    })
                } else {
                    //create the identity
                    var postOptions = {
                        uri: url + '/api/identity',
                        headers: { 'x-user-id': userid },
                        method: 'POST',
                        json: postData
                    };
                    request(postOptions, function(err, postResponse, body) {
                        return nextfunc(err, postResponse)
                    })
                }
            })
        }
    ], function(err, result) {
        if (err){
            console.log('error while calling resonator')
            console.log(err);
            return res.json("user not able to register for push notification");
        }
        return res.json("user registered for push notification");
    })
}

exports.unregister = function (req, res,callback) {
    var data =req.body
      var userid = data.user_id,
      device = data.device,
      url = resonator,
      deviceid = data.device_id;
      async.waterfall([
        function(nextfunc) {
            //check if user exist?
            var options = {
                uri: url + '/api/identity',
                headers: { 'x-user-id': userid },
                method: 'GET'
            };
            request(options, function(err, httpResponse, body) {
                if (!err && httpResponse.statusCode == 200) {
                    //update the deviceid.
                    var postData = JSON.parse(body);
                    //TODO remove the unregistered device from devices.
                    if(device == 'android'){
                        postData.devices.gcm = [];
                    }
                    var putOptions = {
                        uri: url + '/api/identity',
                        headers: { 'x-user-id': userid },
                        method: 'PUT',
                        json: postData
                    }
                    request(putOptions, function(err, postResponse, body) {
                        return nextfunc(err, postResponse)
                    })
                }else{
                    return nextfunc();
                }
            })
        }
    ], function(err, result) {
        if (err){
            console.log('error while  unregistering device resonator')
            console.log(err);
            return res.json("user not able to unregister for push notification");
        }
        return res.json("user unregistered for push notification");
    })
}

exports.send = function(req, res, callback) {
    var data = req.body    
    var touser = data.tousers;
    var messagetype = data.type;
    var title = data.title;
    var message = data.message;
    var appid = data.appid;
    
    //find user by id and get device ids.
    User.findById(touser, function(error, result) {
        if (error) return callback(error);
        if (!result) {
            return callback();
        }
        sendMessage(resonator, title, message, messagetype, [touser], appid, callback);
    });
};
function sendMessage(url, title, text, messagetype, userids, appid, callback) {
    var data = {
        "identities": userids,
        "content": {
            "gcm": {
                "message": {
                    "title": title,
                    "message": text,
                    "type": messagetype
                }
            },
            "apn":{
                "alert":{
                    "title":title,
                    "body":text,
                    "type":messagetype
                },
                "payload":{
                    "type":messagetype
                }
            }
        },
        "appid":appid
    }
    var options = {
        uri: url + '/api/notification/push',
        method: 'POST',
        json: data
    };
    request(options, function(error, response, body) {
        if(error)
          return callback(error);
        else if(response.statusCode != 204)
          return callback(body);
        else
            return res.json(" push notification set");
    });
}









