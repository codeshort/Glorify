var express = require('express');
var router = express.Router();
var user=require('../models/User.js');
var auth=require('../middleware/auth.js');
/* GET users listing. */

// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
//


router.post('/login',async(req,res)=>{
  try{
    console.log("reached");
    // const user= await User.findByCredentials(req.body.email,req.body.password)
    // const token =await user.generateAuthToken()
    res.cookie('jwt',{token:"tojotogjotgjt"}, { maxAge: 3600000 })
    console.log(document.cookie.jwt);
    console.log("cookie");
    res.send({user})
  }catch(e){
      res.status(400).send()
  }
})

router.post('/logout',auth ,async(req,res)=>{
  try {
    req.user.tokens=req.user.tokens.filter((token)=>token.token!==req.token)
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;
