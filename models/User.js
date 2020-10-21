const mongoose = require('mongoose')
const Schema = mongoose.Schema
const user = new Schema({
firstName:{
  type:String,
  required:true
},
lastName:{
  type:String
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
  required:true
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

const User = mongoose.model('user',user)
module.exports= User
