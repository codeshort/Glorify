var express = require('express');
var router = express.Router();
var User=require('../models/User.js');
var Company=require('../models/Company.js')
var auth=require('../middleware/auth.js');
var bcrypt=require('bcryptjs')
const multer=require('multer')
var path = require('path');
const sharp=require('sharp');
// const sharp=require('sharp')
/* GET users listing. */

/* GET users listing. */
var mongoose = require('mongoose')
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
//
router.get('/login',async (req,res)=>{
    res.render(path.join(__dirname+'/../public/Sign/signup-signin'));
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
    res.redirect('/after_login');
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

router.get('/after_login',(req,res)=>{
  res.render(path.join(__dirname+'/../public/Main_page0/After_login'));
})





const upload =multer({
  limits:{
    fileSize:10000000
  },fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
      return cb(new Error('Please upload an img file'))
    }
    cb(undefined,true)

    }
  })
  // var storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, path.join(__dirname,'/../public/'))
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, file.fieldname + '-' + Date.now())
  //   }
  // })
  //
  // var upload = multer({ storage: storage })
  router.use(express.static(path.join(__dirname, '/../public')));

router.get('/post',auth,async (req,res)=>{
  res.sendFile(path.join(__dirname,'/../public/posttest.html'))
})
//making posts

router.post('/post',auth, upload.single('image') ,async(req,res)=>{

try{
  console.log(req.body.data,"uhiuhioj")
console.log(req.file,req.file.buffer)
  var postimage="";
//   if(req.body.contains_image)
//   {
     upload.single(req.body.image)
  const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
//   postimage=buffer
//
//   }

console.log(req.body)

  Company.findOne({companyName:req.user.company},(err,compny)=>{
    compny.posts.push({user:req.user._id,data:req.body.data,contains_image:req.body.contains_image,image:buffer})
console.log(compny)
    compny.save().then(() =>{
      console.log("post added")
console.log(compny.posts)
    })
    res.set('Content-Type','image/png')
      res.send(buffer)
  })
}catch(e)
{
  console.log(e);
}


})


module.exports = router;
