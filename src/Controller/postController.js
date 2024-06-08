
const Post = require('../Models/Posts.js')
const User = require('../Models/User.js')
const {ObjectId} = require('mongodb')


exports.postTweet = async(req,res)=>{
   let userId = new ObjectId(req.session.userId)
   if (req.session && req.session.userId) {
      try{
         let post = await Post.create({
            ...req.body,
            creatorId:req.session.userId
         })
         post = post.toObject()
         delete post.__v
         let userDetail = await User.findOne({_id:userId})
         post.userDetail = userDetail
         return res.status(200).json({msg:'basarili',post})
      }catch(err){
         return res.status(500).json({msg:'beklenmeyen bir hata meydana geldi'})
      }
   } else {
      res.status(403).json({ msg: 'bad request' })
   }

   res.status(200).json({
      message:'tweeting post success'
   })

}
exports.getPostData = async(req,res)=>{
   const offset = parseInt(req.query.pageOffset) || 0
   const limit = parseInt(req.query.postLimit) || 10
   try {
      const postAr = await Post.find({}).select('-__v').skip(offset).limit(limit)
      let newAr = JSON.parse(JSON.stringify(postAr))
      await new Promise(async(res,rej)=>{
         for(let i=0; i<postAr.length;i++){
            let el = postAr[i]
            let detail = await User.findOne({_id:el.creatorId}).select('-__v')
            newAr[i].userDetail = detail
         }
         res()
      })
      res.status(200).json({
         msg: 'fetching post data success',
         data: newAr
      })
   } catch (err) {
      return res.status(503).json({
         msg: ' sunucu hatası'
      })
   }

}
exports.replyPost = async(req,res)=>{
   let post = req.body
   let commentorId = req.session.userId
   let postId = new ObjectId(post.postId)

   try{
      await Post.updateOne(
         {_id:postId},
         { $push: { comments:{ commentorId, commentDetail:post.post }}}
      )
      res.status(200).json({
         msg:' reply post success',
      })
   }catch(err){
      console.log(err)
      res.status(503).json({msg:' error occured when replying'})
   }
}
exports.getComments = async(req,res)=>{
   try{
      let post = await Post.findOne({_id:req.query.postId})
      let userId = new ObjectId(req.session.userId)
      let isActiveUserLiked = post.likeCount.some(item => item.likedId.toString() === userId.toString())
      let newAr = JSON.parse(JSON.stringify(post.comments))
      await new Promise(async(res,rej)=>{
         for(let i=0; i<post.comments.length; i++){
            let userData = await User.findOne({_id:post.comments[i].commentorId}).select('picture name -_id')
            newAr[i].picture = userData.picture
            newAr[i].name = userData.name
         }
         res()
      })
      res.status(200).json({
         msg:' get comments success',
         data: newAr,
         likeCount:post.likeCount,
         isActiveUserLiked,
         activeUserId:req.session.userId
      })
   }catch(err){
      console.log(err,' error occured getting comments');
      res.status(503).json({
         msg:'error occured getting comments'
      })
   }
}
exports.removeLike = async(req,res)=>{
   let userId = new ObjectId(req.session.userId)
   let postId = new ObjectId(req.body.postId)
   let likedElementIdx = req.body.likedElementIdx
   try{
      await Post.updateOne(
         {_id: postId},
         {
            $pull:{
               likeCount:{
                  likedId:userId,
                  likedElementIdx: likedElementIdx ? likedElementIdx : 0
               }
            }
         }
      )
      let updatedPost = await Post.findOne({_id:postId})
      res.status(200).json({
         msg:' removing like success',
         updatedPost,
         likedElementIdx
      })
   }catch(err){
      res.status(503).json({
         msg:' removing like failed'
      })
      console.log(err,' remove like error');
   }
}
exports.likePost = async(req,res)=>{
   let postId = new ObjectId(req.body.postId)
   let userId = new ObjectId(req.session.userId)
   let likedElementIdx = req.body.likedElementIdx
   try{
      await Post.updateOne(
         {_id:postId},
         {
            $push:{
               likeCount:{
                  likedId: userId,
                  likedElementIdx: likedElementIdx
               }
            }
         }
      )
      let updatedPost = await Post.findOne({_id:postId})

      res.status(200).json({
         msg:' liking post success',
         updatedPost,
         likedElementIdx
      })
   }catch(err){
      console.log(err,' like post failed');
      res.status(503).json({
         msg:' like post failed'
      })
   }
}
exports.likeComment = async(req,res)=>{
   try{
      let postId = new ObjectId(req.body.postId)
      let userId = new ObjectId(req.session.userId)
      let param = req.body.param
      let elidx = req.body.elidx
      // if param false, liking post
      // if param true, unliking post
      if(!param){
         await Post.updateOne(
            { _id:postId },
            { 
               $push:{
                  [`comments.${elidx}.commentLikeCount`]:userId
               }
            }
         )
      }else{
         await Post.updateOne(
            { _id:postId },
            {
               $pull:{
                  [`comments.${elidx}.commentLikeCount`]: userId
               }
            }
         )
      }
      res.status(200).json({
         msg:' liking comment success',
      })
   }catch(err){
      console.log(err,' error occured liking comment');
      res.status(503).json({
         msg:' error occured liking comment'
      })
   }
}

