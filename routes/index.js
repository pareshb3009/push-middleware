var express = require('express');
var router = express.Router();
var user = require('../controllers/user');

router.post('/register', user.register);
router.post('/unregister',user.unregister);

router.post('/sendNotification',user.send);

module.exports = router;
