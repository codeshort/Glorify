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




// app.get('/login',(req,res)=>{
// res.sendFile(__dirname+'/public/Sign/signup-signin.html');
// })
// app.post('/login',(req,res)=>{
// console.log('Redirected')
// //  res.sendFile('/public/signup-signin.html');
// })
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
  res.render(__dirname+'/public/profile_page/profile',{
    todo: req.user.todo,
    working:req.user.working,
    done: req.user.done
  });
})
app.post('/profile',auth,async(req,res) =>{




});
app.post('/post/add',auth,(req,res)=>{
  try{
    req.user.todo.push(req.body.name)
    req.user.save().then(() => {
      console.log('Added to do database ')
    })
      res.redirect('/profile')
  }
  catch(e){
    console.log('Todo-error',e);
  }

})
//**************************************************************************************************************************//
app.post('/post/working',auth,(req,res)=>{
  try{
    req.user.working.push(req.body.name)
    req.user.save().then(() =>
    {
      console.log('Added to working database ')
    })
    res.redirect('/profile')
  }
  catch(e)
  {
    console.log('working-error',e);
  }
})

app.post('/post/done',auth,(req,res)=>{
  try{
    req.user.done.push(req.body.name)
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

//
// app.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     // Pass to next layer of middleware
//     next();
// });

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


// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
//
app.listen(3000, ()=>{
  console.log('server is up on 3000')
});

//module.exports = app;
