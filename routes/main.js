let express = require('express');
let router = express.Router();
let path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'app.html'));
});

module.exports = router;
