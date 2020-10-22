const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const schema = mongoose.Schema
const comp = new schema({
companyName:{
  type:String,
  required:true
},
companyCode:{
  type:String,
  //required:true
},
posts:[{
  user:{
    type:String,
    required:true
  },
  data:{
    type:String,
    required:true
  },
  contains_image:{
    type:Boolean,
    default:false
  }
  //timestamps:true
}],
admin:[{
  type:String
}],
members:[{
      userID:{
      type:  mongoose.Schema.Types.ObjectID
    },
    rewardBasket:{
      type:Number
    },
    giveawayBasket:{
      type:Number
    }

}],
location:{
  type:String
},
description:{
  type:String,
  required:true
},

})


const Company = mongoose.model('Company',comp)

module.exports= Company
