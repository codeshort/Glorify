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

}

)
.then(() => console.log('MongoDB Connected....'))
.catch(err => console.log(err));
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(indexRouter);
app.use(usersRouter);
app.use(express.static(path.join(__dirname, '/public')));
// app.get('/',(req,res)=>{
//
//   res.sendFile(__dirname+'/public/Sign/signup-signin.html');
// })
app.post('/',(req,res)=>{
 bcrypt.hash(req.body.password,10,(err,hash)=>{
   if(err){
     return console.log('Password can not be encrpted')
   }
   user = new User({
    Username:req.body.Username,
    email:req.body.email,
    password:hash
  })
  user.save().then(()=>{
    console.log('Data saved')
    console.log(user)
  })

 })
res.redirect('/login')
})
// app.get('/login',(req,res)=>{
// res.sendFile(__dirname+'/public/Sign/signup-signin.html');
// })
// app.post('/login',(req,res)=>{
// console.log('Redirected')
// //  res.sendFile('/public/signup-signin.html');
// })
app.get('/company',(req,res)=>{
  res.sendFile(__dirname+'/public/host-join_company_pages/companysignup.html')
})
app.post('/company',(req,res)=>{
comp = new Company({
  companyName:req.body.name,
  description:req.body.description,
  location:req.body.location,
  companyCode:"abcd"
})
comp.save().then(()=>{
  console.log('Company Registered')
})
res.redirect('/join')
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
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/join',(req,res)=>{
  res.sendFile(path.join(__dirname+'/public/host-join_company_pages/companyjoin.html'))
})

app.post('/join',auth, async (req,res)=>{
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  console.log('Redirected',req.body.CompanyCode)
var comp_code = req.body.CompanyCode
 // res.header('Access-Control-Allow-Headers', "*");
 // app.options('http://localhost:3000',cors())
 // app.use(cors())

// req.method = 'get';
// res.sendFile(path.join(__dirname+'/public/host-join_company_pages/companysignup.html'))
 res.redirect('http://localhost:3000')
//  Company.findOne({"companyCode": comp_code}, 'companyName')
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
