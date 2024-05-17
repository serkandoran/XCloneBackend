
const {v4: uuidv4} = require('uuid')
const Post = require('../Models/Posts.js')

exports.postTweet = async(req,res)=>{

   const postId = uuidv4()

   if (req.session && req.session.userId) {



      Post.create({
         ...req.body,
         creatorId:req.session.userId
      })
      console.log('basarili',{...req.body,creatorId:req.session.userId});
   } else {
      res.status(403).json({ msg: 'bad request' })
   }

   res.status(200).json({
      message:' basarili '
   })

}




