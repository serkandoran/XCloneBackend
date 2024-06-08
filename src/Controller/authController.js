const { ObjectId } = require('mongodb')
const User = require('../Models/User.js')
const dotenv = require('dotenv')
dotenv.config({ path: './src/assets/config.env' })
const { MongoClient } = require('mongodb')


exports.protect = (req,res,next)=>{
   if(req.session && req.session.userId){
      next()
   }else{
      res.status(403).json({msg: 'bad request'})
   }
}
exports.haslogged = async(req,res)=>{
   let userId = new ObjectId(req.session.userId)
   const user = await User.findOne({_id:userId})
   const userPicture = user.picture
   const userName = user.name
   res.status(200).json({
      msg:'basari',
      userId:req.session.userId,
      userPicture,
      userName
   })
}
exports.logout = async(req,res)=>{
   req.session.destroy(err => {
      if(err){
         return res.status(500).json({
            msg:'logout failed'
         })
      }
      res.clearCookie('connect-session')
      fetch('http://localhost:4000/api/v1/clearuserdata',{
         method:'GET'
      })
      .catch(err => console.log(err))
      res.status(200).json({
         msg:'logout success'
      })
   })
}