// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var mongoose = require('mongoose')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bcrypt = require('bcryptjs')
var bodyParser = require('body-parser');
var cors = require('cors')
var hbs = require('hbs')
var app = express();
var user
var comp;
const User = require('./models/User')
const Company = require('./models/Company')
const auth = require('./middleware/auth.js')
const {workdone}= require('./email/email.js');
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
// app.set('view engine', 'html');
// app.use('/static', express.static(__dirname + '/views'));
const db = 'mongodb+srv://Globalshala:OnlineDatabase@cluster0.wkx7c.mongodb.net/DB?retryWrites=true&w=majority'
//const db = 'mongodb://127.0.0.1:27017/new'
mongoose.connect(db,  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
//useFindAndModify: false,
  useCreateIndex: true

})
.then(() => console.log('MongoDB Connected....'))
.catch(err => console.log(err));
// app.use(logger('dev'));
app.set('view engine','hbs')
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(indexRouter);
app.use(usersRouter);

app.get('/',(req,res)=>{

  res.render(path.join(__dirname+'/../public/Sign/signup-signin'));
})

app.get('/main_page',(req,res)=>{

  res.render(path.join(__dirname+'/../public/Main_page/Main_page'));
})


app.get('/company',(req,res)=>{
  res.render(__dirname+'/public/host-join_company_pages/companysignup')
})
app.post('/company',auth,async(req,res)=>{
  try{
    const login_id = req.user._id
    console.log(login_id)
    comp = await new Company({
      companyName:req.body.companyName,
      description:req.body.description,
      location:req.body.location,
      admin: [req.user._id],
      companyCode:"abcd",
      members:[{
            userID:req.user._id,
          rewardBasket:0,
          giveawayBasket:0
      }]
    })
    console.log("Save ke pehle tak")
    comp.save().then(()=>{
      console.log('Company Registered')
    })
    console.log(login_id)
    await User.findOneAndUpdate({_id: login_id} , {company: req.body.companyName , isInCompany: true , isAdmin:false});
        var obj={
          userID:req.user._id,
          rewardBasket:0,
          giveawayBasket:0
        }
       // var comp_members = compny.members;
       // comp_members.push(obj)
       // compny.members= comp_members
       // var comp_admins = compny.admin;
       // comp_admins.push(req.user._id)
       // compny.admin = comp_admins

    res.redirect('/join')
  }
  catch(e) {}
})
// Profile page routing!!


app.get('/profile',auth,(req,res)=>{
  var todo_rev = req.user.todo;
  todo_rev.reverse();
  var working_rev = req.user.working
  working_rev.reverse();
  var done_rev = req.user.done
  done_rev.reverse();
  res.render(__dirname+'/public/profile_page/profile',{
    todo: todo_rev,
    working:working_rev,
    done:done_rev
  });
})
app.post('/profile',auth,async(req,res) =>{
});
router.get('/reward/:id,auth,(req,res)=>{
Company.findOne({companyName:req.user.company},(err,compny)=>{
   compny.members.forEach((usr)=>
if(usr._id === req.params.id){
usr.rewardBasket = usr.rewardBasket + req.body. ;
usr.badgesBasket = usr.badgesBaskte + req.body.     
})
compny.members.forEach((usr)=>
  if(usr._id === req.user._id){
    usr.giveawayBasket = usr.giveawayBasket - req.body. ;
    usr.giveBadgeBasket = usr.giveBadgeBasket - req.body. 
  }
  
)
compny.save().then(()=>{
  console.log(compny)
})
User.findOne({_id:req.user._id},(err,usr)=>{
  var obj1 = {
    
  }
  usr.Total_rewards_given = usr.Total_rewards_given
  usr.Total_badges_given = usr.Total_badges_given
    
    
})
 User.findOne({_id:req.params.id},(err,usr)=>{
  
  
  
}) 
  
  
  
  
})







app.post('/post/add',auth,async(req,res)=>{
  try{
    if(req.query.initial)
    {
      if(req.query.initial=="todo")
      {
        req.user.todo= await req.user.todo.filter(el => el._id!= req.query.obj);
      }
      else if(req.query.initial=="working")
      {
        var added=  await req.user.working.find(el => el._id == req.query.obj);
        req.user.working= await req.user.working.filter(el => el._id!= req.query.obj);
        await req.user.todo.push(added);
      }
      else if(req.query.initial=="done")
      {
        var added=  await req.user.done.find(el => el._id == req.query.obj);
        req.user.done= await req.user.done.filter(el => el._id!= req.query.obj);
        await req.user.todo.push(added);
      }
    }
    else {
         await req.user.todo.push({work:req.body.name,
                assigned_by:req.user._id,
               assigned_by_name: req.user.Username
         });
    }

    await req.user.save().then(() => {
      console.log('Added to do database ')
    });
      res.redirect('/profile')
  }
  catch(e){
    console.log('Todo-error',e);
  }

})
//**************************************************************************************************************************
app.post('/post/working',auth,async(req,res)=>{
  try{
    if(req.query.initial){
      if(req.query.initial=="todo")
      {

          var added=  await req.user.todo.find(el => el._id == req.query.obj);
          //console.log("#########:" , req.user.todo,added);
          req.user.todo= await req.user.todo.filter(el => el._id!= req.query.obj);
          await req.user.working.push(added);
          //console.log(req.user.todo);
      }
      else if(req.query.initial=="working")
      {
        req.user.working= await req.user.working.filter(el => el._id!= req.query.obj);
      }
      else if(req.query.initial=="done")
      {
        var added=  await req.user.done.find(el => el._id == req.query.obj);
        req.user.done= await req.user.done.filter(el => el._id!= req.query.obj);
        await req.user.working.push(added);
      }
    }
  else {
    console.log("working console" ,req.body);
    await req.user.working.push({work:req.body.name,
           assigned_by:req.user._id,
          assigned_by_name: req.user.Username
    })

    }

  await req.user.save().then(() =>
    {
      console.log('Added to working database ')
    });
    res.redirect('/profile')
  }
  catch(e)
  {
    console.log('working-error',e);
  }
})

app.post('/post/done',auth,async(req,res)=>{
  try{
    if(req.query.initial)
    {
       if(req.query.initial == "todo")
       {
        var added=  await req.user.todo.find(el => el._id == req.query.obj);
        req.user.todo= await req.user.todo.filter(el => el._id!= req.query.obj);
        await req.user.done.push(added);
       }
       else if(req.query.initial == "working")
       {
         var added=  await req.user.working.find(el => el._id == req.query.obj);
         req.user.working= await req.user.working.filter(el => el._id!= req.query.obj);
         await req.user.done.push(added);
       }

       else if(req.query.initial=="done")
       {
          req.user.done= await req.user.working.filter(el => el._id!= req.query.obj);
       }
    }
    else {
             req.user.done.push({work:req.body.name,
                    assigned_by:req.user._id,
                   assigned_by_name: req.user.Username
             })
        }
    req.user.save().then(() =>
    {
      console.log('Added to done database ')
    })
      res.redirect('/profile')
  }
  catch(e)
  {
    console.log('done-error',e);
  }
})


app.get('/join',(req,res)=>{
  res.render(path.join(__dirname+'/public/host-join_company_pages/companyjoin'))
})

app.post('/join',auth, async (req,res)=>{
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//  console.log('Redirected',req.body.CompanyCode)
try{
   var comp_code = req.body.CompanyCode
   console.log(req.body.CompanyCode)
  Company.findOne({companyCode: comp_code},'companyName members', async(err,compny) =>{
    if(err)
    {
      console.log('error box ', err)
      return
    }
    found_company= compny.companyName
    console.log(found_company)
    const login_id = req.user._id
    console.log(login_id)
    await User.findOneAndUpdate({_id: login_id} , {company: found_company , isInCompany: true , isAdmin:false} );
    console.log("this happened")
    try{
      var obj={
        userID:req.user._id,
        rewardBasket:0,
        giveawayBasket:0
      }
     var comp_members = compny.members;
     comp_members.push(obj)
     compny.members= comp_members
     compny.save().then(() =>{
       console.log("Join waala save hua hai")
     })
   }

  catch(e){console.log("error-box-2" , e)}
      console.log("this too happened")
  })
 // res.header('Access-Control-Allow-Headers', "*");
 // app.options('http://localhost:3000',cors())
 // app.use(cors())

// req.method = 'get';
// res.sendFile(path.join(__dirname+'/public/host-join_company_pages/companysignup.html'))
console.log('Ye chala')
res.redirect('/company')
//  Company.findOne({"companyCode": comp_code}, 'companyName')
}
catch(e)
{
  console.log(e)
}
})

app.get('/search',auth,async (req,res)=>{
  console.log(req.query.searched_user)
  const compny=await Company.findOne({companyName:req.user.company})
  var mem= compny.members;
  console.log(mem)
  if(req.query.searched_user)
  {
    mem=mem.filter((m)=>{
      return m.name===req.query.searched_user
      // console.log("s",m.name,"s","s",req.query.searched_user,"s")
    })
  }
  console.log(mem)
  res.render(path.join(__dirname+'/public/search/search'),{member:mem })
})




// send grid work ************************************************
app.post('/post/sendmail',auth,async (req,res)=>{
  try{


    var work= await req.user.done.find(el => el._id== req.query.obj);
   const user =await User.findOne({_id:work.assigned_by})


      workdone(user.email,work.work,req.user.Username)
      res.redirect('/profile')
  }
  catch(e)
  {
    console.log('done-error',e);
  }
})




app.listen(3000, ()=>{
  console.log('server is up on 3000')
});

//module.exports = app;
