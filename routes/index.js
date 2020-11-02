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
router.post('/',(req,res)=>{
 bcrypt.hash(req.body.password,10,(err,hash)=>{
   if(err){
     return console.log('Password can not be encrpted')
   }
   user = new User({
    Username:req.body.Username,
    email:req.body.email,
    password:req.body.password
  })
  console.log(user)
  user.save().then(()=>{
    console.log('Data saved')
    console.log(user)
  })

 })
res.redirect('/login')
})






router.get('/login',(req,res)=>{

  res.render(path.join(__dirname+'/../public/Sign/signup-signin'));
})



module.exports = router;
