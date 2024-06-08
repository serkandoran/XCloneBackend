

const mongoose = require('mongoose')
const { Schema } = mongoose


const contentAr_inner_Schema = new Schema({
   ctype: {
      type: String,
      enum: ['image', 'question', 'video', 'gif'],
      required: true
   },
   cdata: {
      type: Schema.Types.Mixed,
      required: true
   },
   _id: false
})
const comment_inner_contentAr = new Schema({
   mtype: {
      type: String,
      enum: ['image', 'question', 'video', 'gif'],
      required: true
   },
   mdata: {
      type: Schema.Types.Mixed,
      required: true
   },
   _id: false
})


const mainAr_inner_Schema = new Schema({
   description:{
      type:String
   },
   contentAr: [contentAr_inner_Schema],
   _id: false
})
const comment_inner = new Schema({
   commentString:{
      type:String
   },
   commentContentAr: [comment_inner_contentAr],
   _id:false
})
const likedElement = new Schema({
   likedId: {
      type: Schema.Types.ObjectId,
      required:true
   },
   likedElementIdx: {
      type: Number,
      default: 0,
   },
   _id:false
})
const postSchema = mongoose.Schema({
   creatorId: {
      type: Schema.Types.ObjectId,
      required: true
   },
   type:{
      type:String,
      enum:['draft','post']
   },
   postDetail: [mainAr_inner_Schema],
   comments:[
      {
         commentorId:{
            type: Schema.Types.ObjectId,
            required:true
         },
         commentDetail:[comment_inner],
         commentLikeCount:[
            {
               type:Schema.Types.ObjectId,
               _id:false
            },
         ]
      }
   ],
   likeCount: [likedElement],
   viewCount:[
      {
         likedPersonId: Schema.Types.ObjectId,
         _id: false
      }
   ],
   repostCount:[
      {
         type: Schema.Types.ObjectId,
      }
   ],
   replyCount:[
      {
         type: Schema.Types.ObjectId,
      }
   ],
})

const Posts = mongoose.model('posts', postSchema)



module.exports = Posts






