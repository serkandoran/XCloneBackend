
const Post = require('../Models/Posts.js')

exports.postTweet = async(req,res)=>{


   if (req.session && req.session.userId) {
      try{
         let post = await Post.create({
            ...req.body,
            creatorId:req.session.userId
         })
         post = post.toObject()
         delete post.__v
         return res.status(200).json({msg:'basarili',post})
      }catch{
         return res.status(500).json({msg:'beklenmeyen bir hata meydana geldi'})
      }
   } else {
      res.status(403).json({ msg: 'bad request' })
   }

   res.status(200).json({
      message:' basarili '
   })

}




