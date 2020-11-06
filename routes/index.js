var express = require('express');
var router = express.Router();
var path = require('path');
router.use(express.static(path.join(__dirname, '/../public')));
var mongoose = require('mongoose')
var User = require('../models/User')
var bcrypt = require('bcryptjs')



router.get('/',(req,res)=>{

  res.render(path.join(__dirname+'/../public/Sign/signup-signin'));
})


router.post('/', async (req, res) => {

    var u = await User.findOne({ email: req.body.email });   //checking if email already exists
    if (u) {     //will send an error message if the email already exists
        return res.render(path.join(__dirname + '/../public/Sign/signup-signin'), {
            signupmsg: "Email already exists",
        })
    }

    bcrypt.genSalt(10, function (err, Salt) {    //bcrypt is used for encrypting password.
        bcrypt.hash(req.body.password, Salt, function (err, hash) {
            var user = new User({   //all the fields of the requested user is filled
                Username: req.body.Username,
                email: req.body.email,   
                password: hash
            })

            user.save().then(() => { //data is saved to database

            })
        })
    })

    res.redirect('/login')   
})







router.get('/login',(req,res)=>{

  res.render(path.join(__dirname+'/../public/Sign/signup-signin'));  //will be redirected to sign-up sign-in page
})



module.exports = router;
