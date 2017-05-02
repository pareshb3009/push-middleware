var express = require('express');
var router = express.Router();
var user = require('../controllers/user');

router.post('/syncAgentlocations', user.saveLocations);
//router.post('/startTracking',user.startTracking);
router.post('/stopTracking',user.stopTracking);

router.get('/search',user.agentSearch);
router.get('/lastLocation',user.lastLocation);


module.exports = router;
