const jwt =require('jsonwebtoken')
const User=require('../models/User')

const auth =async(req,res,next)=>{
  try{
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    console.log("again")
    console.log("abcd ", req.header('Authorization'))

    const token= await req.header('Authorization').replace('Bearer ','')
    const decoded=await jwt.verify(token,'secret')
    console.log(token+"*****************"+decoded._id)
    const user =await User.findOne({_id:decoded._id})
    console.log("efgh ",user)
    if(!user){
      throw new Error()
    }
    req.user=user
    next()
  }catch(e){
    console.log(e)
    res.status(400).send({error:'Please authenciate'})

  }
}

module.exports=auth

//
// const login = async (req, res) => {
//   try {
//     let user = await User.findOne({
//       "email": req.body.email
//     })
//
//     if (!user)
//       return res.status('401').json({
//         error: "User not found"
//       })
//
//     if (!user.authenticate(req.body.password)) {
//       return res.status('401').send({
//         error: "Email and password don't match."
//       })
//     }
//
//     const token = jwt.sign({
//       _id: user._id
//     }, config.jwtSecret)
//
//     res.cookie("teaspoon", token, {
//       expire: new Date() + 9999
//     })
//
//     return res.json({
//       token,
//       user: {_id: user._id, name: user.name, email: user.email}
//     })
//   } catch (err) {
//     console.log(err)
//     return res.status('401').json({
//       error: "Could not sign in"
//     })
//
//   }
// }
//
// const logout = (req, res) => {
//   res.clearCookie("teaspoon")
//   return res.status('200').json({
//     message: "signed out"
//   })
// }

//module.exports={login,logout};
