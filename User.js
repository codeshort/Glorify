const mongoose = require('mongoose')

const db = 'mongodb+srv://Globalshala:OnlineDatabase@cluster0.wkx7c.mongodb.net/DB?retryWrites=true&w=majority'
mongoose.connect(db,{useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false,
useCreateIndex: true},()=>{
})

var d = mongoose.connection;
d.on('error', console.error.bind(console, 'connection error:'));
d.once('open', function callback () {
  console.log("h");
});

const Schema = mongoose.Schema
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const userSchema = new Schema({
Username:{
  type:String,
  required:true
},
email:{
  type:String,
  required:true
},
password:{
  type:String,
  required:true
},
tokens:[{
  type:String
}],
avatar:{
  type:Buffer,
},
gender:{
  type:String,
},
company:{
  type:String
  //not adding required field cause it will not be used now.
},
isInCompany:{
  type:Boolean
},
isAdmin:{
  type:Boolean
}

})



userSchema.methods.generateAuthToken=async function(){
  const usr=this
  const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
  usr.tokens=user.tokens.concat({token})
  await usr.save()
    return token
}
userSchema.statics.findByCredentials=async(email,password)=>{
  const usr=await User.findOne({email})
  if(!usr){
    throw new Error('Unable to login')
  }
  const isMatch= await bcrypt.compare(password,usr.password)
  if(!isMatch){
    throw new Error('Unable to login')
  }
  return usr
}



const User = mongoose.model('User',userSchema)
module.exports= User
