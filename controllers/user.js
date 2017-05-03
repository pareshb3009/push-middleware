var async = require('async');
var Model = require('../models/User');
var request = require('request');
var TimeZone = require('../config/secrets').timezone;
var moment = require('moment-timezone');
var mongoose = require('mongoose');
var secrets = require('../config/secrets');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var resonator = secrets.resonatorHost;

exports.register = function(req, res, callback) {
    var data =req.body;

    if(!data.user_id) return callback(new Error("user_id missing"))
    if(!data.device) return callback(new Error("device missing"))
    if(!data.appid) return callback(new Error("appid missing"))
    if(!data.device_id) return callback(new Error("device_id missing"))
    var url = resonator,
        userid = data.user_id,
        device = data.device,
        deviceid = {
            "appid":data.appid,
            "code":data.device_id,
        },
        mobilenumber=""

    async.waterfall([
        function(nextfunc) {
            Model.findOne({user_id: data.user_id, appid: data.appid}, function(e, userObj){
                if(e) return nextfunc(e)
                if(!userObj) {
                    //insert
                    var userData = {
                        user_id: data.user_id,
                        appid: data.appid
                    }

                    var user = new Model(userData);
                    user.save(function(err, user) {
                        if (err) {
                            return nextfunc(err)
                        };
                        return nextfunc(null, user._id)
                    })
                }
                else
                {
                    return nextfunc(null, userObj._id)
                }
            })
        },
        function(userObjectId, nextfunc) {
            //check if user exist?
            var postData = {
                _id: userObjectId,
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
                headers: { 'x-user-id': userObjectId },
                method: 'GET'
            };
            request(options, function(err, httpResponse, body) {
                if (!err && httpResponse.statusCode == 200) {
                    //update the deviceid.
                    if(body){
                    	//update the deviceid.
                    	try {
                            postData = JSON.parse(body);
                  			// postData.devices = body.devices;
                  			if(device =='ios'){
                                if(postData.devices.apn){
                                    postData.devices.apn.push(deviceid);
                                }else{
                                  postData.devices.apn = [deviceid];
                                }
                            }
                  			else if(device == 'android'){
                                if(postData.devices.gcm){
                                    postData.devices.gcm.push(deviceid);
                                }else{
                  				  postData.devices.gcm = [deviceid];
                                }
                            }
                  		} catch(e) {
                  			console.log(e);
                  		}
                  	}
                    var putOptions = {
                        uri: url + '/api/identity',
                        headers: { 'x-user-id': userObjectId },
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
                        headers: { 'x-user-id': userObjectId },
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
    if(!data.user_id) return callback(new Error("user_id missing"))
    if(!data.device) return callback(new Error("device missing"))
    if(!data.appid) return callback(new Error("appid missing"))
    if(!data.device_id) return callback(new Error("device_id missing"))
      var userid = data.user_id,
      device = data.device,
      url = resonator,
      deviceid = data.device_id;
      appid = data.appid;
      async.waterfall([
        function(nextfunc) {
            Model.findOne({user_id: data.user_id, appid: data.appid}, function(e, userObj){
                if(e) return nextfunc(e)
                if(!userObj) {
                    //insert
                    var userData = {
                        user_id: data.user_id,
                        appid: data.appid
                    }

                    var user = new Model(userData);
                    user.save(function(err, user) {
                        if (err) {
                            return nextfunc(err)
                        };
                        return nextfunc(null, user._id)
                    })
                }
                else
                {
                    return nextfunc(null, userObj._id)
                }
            })
        },
        function(userObjectId, nextfunc) {
            //check if user exist?
            var options = {
                uri: url + '/api/identity',
                headers: { 'x-user-id': userObjectId },
                method: 'GET'
            };
            request(options, function(err, httpResponse, body) {
                if (!err && httpResponse.statusCode == 200) {
                    //update the deviceid.
                    var postData = JSON.parse(body);
                    //TODO remove the unregistered device from devices.

                    if (device == 'android') {
                       // postData.devices.gcm = [];
                       var index;
                       postData.devices.gcm.forEach(function (obj, n) {
                           if (obj.code == deviceid) {
                               index = n;
                           }
                       })
                       postData.devices.gcm.splice(index, 1);
                    }
                    if (device == 'ios') {
                       // postData.devices.gcm = [];
                       var index;
                       postData.devices.apn.forEach(function (obj, n) {
                           if (obj.code == deviceid) {
                               index = n;
                           }
                       })
                       postData.devices.apn.splice(index, 1);
                    }

                    var putOptions = {
                        uri: url + '/api/identity',
                        headers: { 'x-user-id': userObjectId },
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

    if(!data.type) return callback(new Error("type missing"))
    if(!data.title) return callback(new Error("title missing"))
    if(!data.appid) return callback(new Error("appid missing"))
    if(!data.message) return callback(new Error("message missing"))  
    if(!data.tousers) return callback(new Error("tousers missing"))  
    if(!data.tousers.length) return callback(new Error("tousers missing"))     

    var touser = data.tousers;
    var messagetype = data.type;
    var title = data.title;
    var message = data.message;
    var appid = data.appid;

    Model.find({user_id: {$in:data.tousers}, appid: data.appid }, {_id:1}, function(e, userArray){
        if (e) return callback(e);
        if (!userArray.length) {
            return callback(new Error("users not found"));
        }
        var userids = []
        userArray.forEach(function(user){
            userids.push(user._id.toString())
        })
        sendMessage(resonator, title, message, messagetype, userids, appid, function(e,data){
            if(e) return callback(e);
            return res.send(data);
        });
    })

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
            return callback(null," push notification sent");
    });
}









