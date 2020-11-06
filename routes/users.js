var express = require('express');
var router = express.Router();
var User=require('../models/User.js');
var Company=require('../models/Company.js')
var auth=require('../middleware/auth.js');
var bcrypt=require('bcryptjs')
const multer=require('multer')
var path = require('path');
const sharp=require('sharp');
const jwt =require('jsonwebtoken')
var mongoose = require('mongoose')


router.get('/login',async (req,res)=>{
    res.render(path.join(__dirname+'/../public/Sign/signup-signin')); //will render signup-signin page
})

router.post('/login', async (req, res) => {
    try {

        User.findOne({ "email": req.body.email }, 'Username email password', async (err, usr) => {

            if (!usr) {    //If there is no registered mail the following message would be sent
                return res.render(path.join(__dirname + '/../public/Sign/signup-signin'), {
                    loginmsg: "Email or password incorrect!"
                })
            }
            bcrypt.compare(req.body.password, usr.password, async function (err, isMatch) {

                if (isMatch) {   //If the password matches the user is redirected to homepage

                    const token = await usr.generateAuthToken()    //auth token is generated


                    res.cookie('jwt', token, { maxAge: 3600000 })   //cookie is created

                    res.redirect('/after_login');
                }
                if (!isMatch) { //If password doesn't match the following message will be sent
                    return res.render(path.join(__dirname + '/../public/Sign/signup-signin'), {
                        loginmsg: "Email or password incorrect!"
                    })
                }

            })

        })


    } catch (e) {
        res.status(400).send()
    }
})



router.get('/logout',auth ,async(req,res)=>{
    try {

        res.clearCookie("jwt");          //the cookie will be destroyed if logout button is pressed.

        res.render(path.join(__dirname+'/../public/Main_page0/After_login'),{button_name:"Login/Signup",button_name_link:"login"}); //redirected to the home page but logout button changed to login        //the user will be redirected to home page.

    } catch (e) {
        res.status(500).send()
    }
})

router.get('/after_login',async(req,res)=>{

    try{
        const token= await req.cookies['jwt'];
        if(!token)
        {
             throw new Error()

        }
        const decoded=await jwt.verify(token,'secret')
        const user =await User.findOne({_id:decoded._id})
        if(!user){
            throw new Error()
        }
        req.user=user
        res.render(path.join(__dirname+'/../public/Main_page0/After_login'),{user:req.user,button_name:"Log out",button_name_link:"logout"});
    }catch(e){
    console.log(e);
    res.render(path.join(__dirname+'/../public/Main_page0/After_login'),{button_name:"Login/Signup",button_name_link:"login"})
}


}

)





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
    router.use(express.static(path.join(__dirname, '/../public')));

    router.get('/post',auth,async (req,res)=>{

    Company.findOne({companyName:req.user.company},(err,compny)=>{
    var c=compny.posts;
    c.reverse();
    for (i = 0; i < c.length; i++) {
        c[i].image   = new Buffer(c[i].image).toString('base64');

    }
    var sort_list = compny.members;
    sort_list.sort((a, b) => (a.rewardBasket < b.rewardBasket) ? 1 : -1);
    sort_list= sort_list.slice(0,10);
        for(i=0;i<sort_list.length;i++)
        {
            console.log(sort_list[i]);
        }
        res.render(path.join(__dirname,'/../public/posts-page/posts'),{
            feed:c,
            companyCode : compny.companyCode,
            companyName : compny.companyName,
            description:compny.description,
            location: compny.location,
            members: sort_list
        });
    });
});

router.post('/post',auth, upload.single('image') ,async(req,res)=>{

    try{
        console.log(req.file,req.file.buffer)
        var postimage="";
        upload.single(req.body.image)
        const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
        console.log(req.body)
        await Company.findOne({companyName:req.user.company},async(err,compny)=>{
            await compny.posts.push({
                user: req.user._id,name:req.user.Username, data: req.body.data, contains_image: req.body.contains_image, image: buffer, curr_date: new Date(), timestamp: Date.now(), string_date: Date(), date: (Date())[8] + (Date())[9],
                month: (Date())[4] + (Date())[5] + (Date())[6], hour: (Date())[16] + (Date())[17], min: (Date())[19] + (Date())[20]
            })
            console.log(compny)
            await compny.save().then(() =>{
                console.log("post added")
                console.log(compny.posts)
            })
            res.redirect('/post')
        })
    }catch(e)
        {
             console.log(e);
        }
})


router.get('/click/:id', auth, async (req, res) => {
    await  Company.findOne({ companyName: req.user.company }, async(err, compny) => {//company is extracted from database whose name is equal to user;s company name
        await compny.posts.forEach( async(post) => {
            if (post.id === req.params.id) {
                 await req.user.liked_posts.push(post.id)
                 await  post.likes.push(req.user._id)
                 post.likes_count = await (post.likes_count + 1)
            }
        })
        await compny.save().then(() => {
            console.log('Likes increased')
        })
        await   req.user.save().then(() => {
        })
    })
    res.redirect('/post')

})





module.exports = router;
