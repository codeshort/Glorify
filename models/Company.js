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
    },
    likes_count: {
        type: Number,
        default:0
    },
    likes: [{
        type:mongoose.Schema.Types.ObjectID
    }]
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
      badge1:{
        type:Number
        ,default:0
    
      },
      badge2:{
        type:Number
        ,default:0

      },
      badge3:{
        type:Number
        ,default:0

      },
      badge4:{
        type:Number
        ,default:0

      },

    },
    givebadgeBasket:{
      badge1:{
        type:Number,
        default:0

      },
      badge2:{
        type:Number
        ,default:0

      },
      badge3:{
        type:Number
        ,default:0

      },
      badge4:{
        type:Number
        ,default:0

      },
    },

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
