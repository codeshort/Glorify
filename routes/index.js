var express = require('express');
var router = express.Router();
var path = require('path');
router.use(express.static(path.join(__dirname, '/../public')));
var mongoose = require('mongoose')
var User = require('../models/User')
var bcrypt = require('bcryptjs')
/* GET home page. */
router.get('/main_page',(req,res)=>{
    res.render(path.join(__dirname+'/../public/Main_page/Main_page'));
})


router.get('/',(req,res)=>{

  res.render(path.join(__dirname+'/../public/Sign/signup-signin'));
})


router.post('/', async (req, res) => {

    var u = await User.findOne({ email: req.body.email });
    if (u) {
        return res.render(path.join(__dirname + '/../public/Sign/signup-signin'), {
            signupmsg: "Email already exists",
        })
    }

    bcrypt.genSalt(10, function (err, Salt) {
        bcrypt.hash(req.body.password, Salt, function (err, hash) {
            var user = new User({
                Username: req.body.Username,
                email: req.body.email,
                password: hash
            })

            user.save().then(() => {

            })
        })
    })





    res.redirect('/login')
})







router.get('/login',(req,res)=>{

  res.render(path.join(__dirname+'/../public/Sign/signup-signin'));
})



module.exports = router;
