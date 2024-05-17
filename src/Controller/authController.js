const User = require('../Models/User.js')


exports.protect = (req,res,next)=>{
   if(req.session && req.session.userId){
      next()
   }else{
      res.status(403).json({msg: 'bad request'})
   }
}

exports.haslogged = (req,res)=>{
   res.status(200).json({
      msg:'basari'
   })
   
}




