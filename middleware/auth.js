const jwt =require('jsonwebtoken')
const User=require('../models/User')

const auth =async(req,res,next)=>{
  try{
    const token=req.header('Authorization').replace('Bearer ','')
    const decoded=jwt.verify(token,'htaed')
    const user =await User.findOne({_id:decoded._id,'tokens.token':token})
    if(!user){
      throw new Error()
    }
    req.user=user
    req.token=token
    next()
  }catch(e){
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
