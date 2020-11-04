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
  },
  image:{
    type:Buffer
  }
  //timestamps:true
}],
admin:[{
  type:mongoose.Schema.Types.ObjectID
}],
members:[
    {
      userID:{
      type:  mongoose.Schema.Types.ObjectID
    },
    name:{
      type:String
    },
    rewardBasket:{
      type:Number
    },
    giveawayBasket:{
      type:Number
    },
    badgesBasket:{
      type:Number
    },
    giveBadgeBasket:{
      type:Number
    }

}],
location:{
  type:String
},
description:{
  type:String,
},

})


const Company = mongoose.model('Company',comp)

module.exports= Company
