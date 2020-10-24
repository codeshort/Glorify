var express = require('express');
var router = express.Router();
var User=require('../models/User.js');
var auth=require('../middleware/auth.js');
var bcrypt=require('bcryptjs')
/* GET users listing. */

// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
//
router.get('/login',async (req,res)=>{
  console.log("login");
})

router.post('/login',async (req,res)=>{
  try{

    console.log("reached",req.body.password);
    bcrypt.hash(req.body.password,10,(err,hash)=>{
    if(err){
        console.log('Password can not be encrypted')
    }
      console.log(req.body.email,req.body.password);
      console.log(User,"gghhjh");

 User.findOne({"email":req.body.email,"password":req.body.password},'Username email password',   async (err, usr)=> {
  if (err) {
    console.log(err);
    return
  }

    console.log(hash,usr)
     console.log(usr.Username)
     const token =await  usr.generateAuthToken()
    console.log("cookie")
  //  console.log(req.cookies);
  console.log(token);
    res.cookie('jwt',token, {maxAge: 3600000 })
    console.log(req.cookies);
    console.log("cookie");
    res.send("yo");
})
});
}
  catch(e){
      res.status(400).send()
  }
})

router.get('/logout',auth ,async(req,res)=>{
  try {
 console.log("f",req.cookies);

    // req.cookies.set('jwt', {maxAge: 0});
    res.clearCookie("jwt");

    console.log("s",req.cookies);

    res.send("done");
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;
