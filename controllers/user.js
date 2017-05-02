var async = require('async');
var Model = require('../models/User');
var request = require('request');
var TimeZone = require('../config/secrets').timezone;
var moment = require('moment-timezone');
var mongoose = require('mongoose');
var secrets = require('../config/secrets');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// exports.get = function(req, res, next) {
//     var id = req.params.id;
//     var search={};    
//     search._id = id;
//     Model.findOne(search,function(error,obj){
//         if(error)
//             return next(new Error(error));
//         return res.json(obj);
//     });
// };

// function addProfile(data,providerObj,cb) {
//   var data = {
//         patcode : data.patCode,
//         mobilenumber : data.mobilenumber,
//         profileid : data.profile_id,
//         PatFName:data.firstname,
//         PatLName:data.lastname,
//         age:data.age,
//         gender:data.gender,
//         VstTitle:data.salutation,
//         PatAddress:data.address1,
//         City:data.city
//     }
//   providerObj = providerObj.toObject();
//     async.waterfall([
//       //get headers from LIMS
//       function(nextfunc){
//         var url = providerObj.config.webhooks.addProfile.url;
        
//         var options = {
//             uri: url,
//             method: 'POST',
//             json:true,
//             body:data
//         };
//         request(options, function(err, httpResponse, body) {
                
//           if (!err && httpResponse.statusCode == 200) {
//               return nextfunc(null, body)
//           } else {
//               console.log("Got error: ",err);
//               return nextfunc(err);
//           }
//         })
//       }
//       ],function(e,r){
//         r.address1 = r.PatAddress;
//         r.firstname=r.PatFName;
//         r.lastname = r.PatLName;
//         r.age = r.age;
//         r.gender = r.gender;
//         r.patCode = r.patcode;
//         r.salutation = r.VstTitle;
//         r.city = r.City;
//         return cb(e,r)
//     })
// }

// function getOrders(data,providerObj,cb) {
//     providerObj = providerObj.toObject();
//       async.waterfall([
//         //get headers from LIMS
//         function(nextfunc){
//          var url = providerObj.config.webhooks.pullorders.url + '/'+data;
//           var httpProtocol = http;
//           if(urlParser.parse(url).protocol == 'https:')
//             httpProtocol = https;
//          httpProtocol.get(url, function(res) {
//            var body = '';
//                res.on('data', function(chunk) {
//                    body += chunk;
//                });
//                res.on('end', function() {
//                  body = JSON.parse(body);
//                  return nextfunc(null, body)
//               });
//             })
//             .on('error', function(e) {
//              console.error("Got error: " + e.message);
//              return nextfunc(e);
//             });
//         }
//         ],function(e,r){
//             return cb(e,r)
//       })
// }









