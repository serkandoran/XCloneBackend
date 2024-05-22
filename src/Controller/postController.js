
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
exports.getPostData = async(req,res)=>{
   const offset = parseInt(req.query.pageOffset) || 0
   const limit = parseInt(req.query.postLimit) || 10

   try {

      const postAr = await Post.find({}).skip(offset).limit(limit)

      res.status(200).json({
         msg: 'basarili',
         data: postAr
      })
   } catch (err) {
      return res.status(503).json({
         msg: ' sunucu hatası'
      })
   }

}




