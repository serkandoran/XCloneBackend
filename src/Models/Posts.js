

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


const mainAr_inner_Schema = new Schema({
   description:{
      type:String
   },
   contentAr: [contentAr_inner_Schema],
   _id: false
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
   likeCount: {
      type: Number,
      default: 0
   },
   viewCount: {
      type: Number,
      default: 0
   },
   repostCount: {
      type: Number,
      default: 0
   },
   replyCount: {
      type: Number,
      default: 0
   }
})

const Posts = mongoose.model('posts', postSchema)



module.exports = Posts






