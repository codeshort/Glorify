var express = require('express');
var router = express.Router();
var path = require('path');
router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/',(req,res)=>{

  res.sendFile(path.join(__dirname+'/../public/Sign/signup-signin.html'));
})

module.exports = router;
