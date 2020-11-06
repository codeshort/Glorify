var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
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
var bcrypt = require('bcryptjs')
const db = 'mongodb+srv://Globalshala:OnlineDatabase@cluster0.wkx7c.mongodb.net/DB?retryWrites=true&w=majority'
mongoose.connect(db,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('MongoDB Connected....'))
.catch(err => console.log(err));
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
    res.render(path.join(__dirname+'/../public/Sign/signup-signin'));//will render the signup-signin page 
})



app.get('/company',(req,res)=>{
    res.render(__dirname+'/public/host-join_company_pages/companysignup') //will render the company register page
})
app.post('/company',auth,async(req,res)=>{
    try{
        const login_id = req.user._id
        var c=Company.findOne({companyName:req.body.companyName})         //find a company from the company database whose name will be equal to the entered company name by user
        if(c.companyName){                       //checks whether the company already exists or not.
            return   res.render(path.join(__dirname+'/public/host-join_company_pages/companysignup'),{
                hostmsg:`Company : ${req.body.companyName} is already registered`
            })
        }
        bcrypt.genSalt(10, async(err, Salt)=> {  //using bcrypt for creating a unique company code
            bcrypt.hash(req.body.companyName, Salt,async(err, hash) =>{
                var comp = await new Company({        //all fields of compnare filled
                    companyName:req.body.companyName,
                    description:req.body.description,
                    location:req.body.location,
                    admin: [req.user._id],
                    members:[{
                        userID:req.user._id,
                        name:req.user.Username,
                        rewardBasket:0,
                        giveawayBasket:0,
                        badgesBasket:{badge1:0,badge2:0,badge3:0,badge4:0},
                        givebadgeBasket:{badge1:3,badge2:3,badge3:3,badge4:3},
                    }],
                    companyCode:hash  
                })
                comp.save().then(()=>{   //comp is saved to company database
                console.log('Company Registered')
            })
        })
    });
    console.log(login_id)
    await User.findOneAndUpdate({_id: login_id} , {company: req.body.companyName , isInCompany: true , isAdmin:false});   //value of fields of user who has joined the company is updated in user database
        var obj={
            userID:req.user._id,
            rewardBasket:0,
            giveawayBasket:0
        } 
         res.redirect('/profile')         //will be rediected to profile after joining.
    }
  catch(e) {}
})



//************* Profile page routing!!********************
app.get('/profile',auth,(req,res)=>{
    res.redirect(`/profile/${req.user._id}`)
})
app.get('/profile/:id',auth,async (req,res)=>{
    var usr=await User.findById(req.params.id)  
    var todo_rev = usr.todo;
    todo_rev.reverse();
    var working_rev =usr.working
    working_rev.reverse();
    var done_rev = usr.done
    done_rev.reverse();
    console.log(todo_rev,working_rev,done_rev,req.params.id)
    res.render(__dirname+'/public/profile_page/profile',{
        todo: todo_rev,
        working:working_rev,
        done:done_rev,
        usrid:req.params.id,
        Username:usr.Username,
        Designation:usr.Designation,
        rewardBasket:usr.Total_rewards_received,
        giveawayBasket:usr.Total_giveaway_rewards_left,
        badgesBasket:usr.badgesBasket,
        givebadgeBasket:usr.givebadgeBasket,
    });
})

app.get('/reward',auth,async (req,res)=>{
    var profileuser=await User.findById(req.query.usrid)
    if(profileuser.hierarchy>req.user.hierarchy)
    {
        return   res.status(400).redirect(`/profile/${req.query.usrid}`)
    }
    if(profileuser.company===req.user.company)
    {
        if(req.query.credits)
        {
            if(  req.user.Total_giveaway_rewards_left< parseInt(req.query.credits))
            {
                return   res.status(400).redirect(`/profile/${req.query.usrid}`)
            }
            profileuser.Total_rewards_received+= parseInt(req.query.credits);
            req.user.Total_giveaway_rewards_left-= parseInt(req.query.credits);
        }
        if(req.query.badge)
        {

            var b=req.query.badge
            if(  req.user.givebadgeBasket['badge'+b]<=0){
                return   res.status(400).redirect(`/profile/${req.query.usrid}`)
            }
            if(b==='1')
            {
                profileuser.badgesBasket['badge1'] += 1;
                req.user.givebadgeBasket['badge1']-=1;
            }
            if (b === '2')
            {
                profileuser.badgesBasket['badge2'] += 1;
                req.user.givebadgeBasket['badge2']-=1;
            }
            if (b === '3')
            {
                profileuser.badgesBasket['badge3'] += 1;
                req.user.givebadgeBasket['badge3']-=1;
            }
            if (b === '4')
            {
                profileuser.badgesBasket['badge4'] += 1;
                req.user.givebadgeBasket['badge4']-=1;
            }

            profileuser.save().then(()=>{
            })
            req.user.save().then(()=>{
            })

            var cmp=await Company.findOne({companyName:req.user.company})
            var ind=cmp.members.findIndex(el=>el.userID==req.user.id)
            cmp.members[ind].badgesBasket=req.user.badgesBasket;
            cmp.members[ind].givebadgeBasket=req.user.givebadgeBasket;
            cmp.members[ind].rewardBasket=req.user.Total_rewards_received;
            cmp.members[ind].giveawayBasket=req.user.Total_giveaway_rewards_left;
            ind=cmp.members.findIndex(el=>el.userID==req.query.usrid)
            cmp.members[ind].badgesBasket=profileuser.badgesBasket;
            cmp.members[ind].givebadgeBasket=profileuser.givebadgeBasket;
            cmp.members[ind].rewardBasket=profileuser.Total_rewards_received;
            cmp.members[ind].giveawayBasket=profileuser.Total_giveaway_rewards_left;
            cmp.save().then(()=>{
            })

        }
        res.redirect(`/profile/${req.query.usrid}`)

    }
})










app.post('/profile/post/add',auth,async(req,res)=>{
    try{
        var assigned=req.user._id;
        var assigned_by_n=req.user.Username;
        req.user=await User.findById(req.query.usrid)
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
            await req.user.todo.push({
                work: req.body.name,
                assigned_by:assigned,
                assigned_by_name: assigned_by_n,
                curr_date: new Date(),
                timestamp: Date.now(),
                string_date: Date(),
                date: (Date())[8] + (Date())[9],
                month: (Date())[4] + (Date())[5] + (Date())[6]
            });
        }

        await req.user.save().then(() => {
            console.log('Added to do database ')
        });
        res.redirect(`/profile/${req.query.usrid}`)
    }
    catch(e){
        console.log('Todo-error',e);
    }

})
//**************************************************************************************************************************
app.post('/profile/post/working',auth,async(req,res)=>{
    try{
        var assigned=req.user._id;
        var assigned_by_n=req.user.Username;

        req.user=await User.findById(req.query.usrid)
        if(req.query.initial){
            if(req.query.initial=="todo")
            {
                var added=  await req.user.todo.find(el => el._id == req.query.obj);
                req.user.todo= await req.user.todo.filter(el => el._id!= req.query.obj);
                await req.user.working.push(added);
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
            await req.user.working.push({
                work: req.body.name,
                assigned_by:assigned,
                assigned_by_name: assigned_by_n,
                curr_date: new Date(),
                timestamp: Date.now(),
                string_date: Date(),
                date: (Date())[8] + (Date())[9],
                month: (Date())[4] + (Date())[5] + (Date())[6]
            })

        }

        await req.user.save().then(() =>
        {
            console.log('Added to working database ')
        });
        res.redirect(`/profile/${req.query.usrid}`)
    }
    catch(e)
    {
        console.log('working-error',e);
    }
})

app.post('/profile/post/done',auth,async(req,res)=>{
    try{
        var assigned=req.user._id;
        var assigned_by_n=req.user.Username;
        req.user=await User.findById(req.query.usrid)
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
                req.user.done= await req.user.done.filter(el => el._id!= req.query.obj);
            }
        }
        else {
            req.user.done.push({
                work: req.body.name,
                assigned_by:assigned,
                assigned_by_name: assigned_by_n,
                curr_date: new Date(),
                timestamp: Date.now(),
                string_date: Date(),
                date: (Date())[8] + (Date())[9],
                month: (Date())[4] + (Date())[5] + (Date())[6]
             })
        }
        req.user.save().then(() =>
        {
            console.log('Added to done database ')
        })
        res.redirect(`/profile/${req.query.usrid}`)
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

    try{
        if(req.user.isInCompany)
        {
            return  res.render(path.join(__dirname+'/public/host-join_company_pages/companyjoin'),{
                joinmsg: "You can only join one company at a time!",
            });
        }
        var comp_code = req.body.CompanyCode
        Company.findOne({companyCode: comp_code},'companyName members', async(err,compny) =>{
            if(err)
            {
                console.log('error box ', err)
                return
            }
            found_company= compny.companyName
            const login_id = req.user._id
            await User.findOneAndUpdate({_id: login_id} , {company: found_company ,   Designation:req.body.Designation,
                                                    hierarchy:req.body.hierarchy,isInCompany: true , isAdmin:false} );
            try{
                var obj={
                    userID:req.user._id,
                    name:req.user.Username
                }
                var comp_members = compny.members;
                comp_members.push(obj)
                compny.members= comp_members
                compny.save().then(() =>{
                })
            }

            catch (e) {
                console.log("error-box-2", e)
            }
            console.log("this too happened")
        })
        res.redirect('/profile')

    }
    catch(e)
    {
    console.log(e)
    }
})

app.get('/search',auth,async (req,res)=>{
    const compny=await Company.findOne({companyName:req.user.company})
    var mem= compny.members;
    if(req.query.searched_user)
    {
        mem=mem.filter((m)=>{
        return m.name===req.query.searched_user
        })
    }
    res.render(path.join(__dirname+'/public/search/search'),{member:mem })
})




// send grid work ************************************************
app.post('/profile/post/sendmail',auth,async (req,res)=>{
    try{
        var work= await req.user.done.find(el => el._id== req.query.obj);
        const user =await User.findOne({_id:work.assigned_by})
        workdone(user.email,work.work,req.user.Username)
        res.redirect('/profile')
    }
    catch(e)
    {
    console.log('done-error',e);
    res.redirect('/profile')
    }
})




app.listen(3000, ()=>{
    console.log('server is up on 3000')
});
