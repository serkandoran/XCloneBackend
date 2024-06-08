const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config({path:'./src/assets/config.env'})
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const googleAuth = require('./src/Controller/GoogleAuth/googleAuth.js')
const MongoStore = require('connect-mongo')
const postController = require('./src/Controller/postController.js')

const DB = process.env.DATABASE.replace(
   '<PASSWORD>',
   process.env.DATABASE_PASSWORD
)

const app = express()
app.use(cookieParser())
app.use(express.json({limit: '500mb'}))
app.use(express.urlencoded({limit:'500mb', extended:true}))
app.use(cors({
   origin: 'http://localhost:3000',
   credentials: true
}))


mongoose.connect(DB)
.then(con =>{
   console.log('baglandi');
})
.catch(err =>{
   if(err) console.log(err, 'veritabanı baglanti hatasi');
})

const authController = require('./src/Controller/authController.js')
const userController = require('./src/Controller/userController.js')


app.use(session({
   name: 'connect-session',
   secret: 'very-long-secret-auth-secret',
   cookie: { maxAge: 60 * 60 * 1000 },
   saveUninitialized: false,
   resave:false,
   store: new MongoStore({
      mongoUrl: 'mongodb+srv://serkan:serkan123@cluster0.ewau8v3.mongodb.net/twitterclone?retryWrites=true&w=majority',
      collectionName: 'sessions',
      ttl: 7000,
      autoRemove:'interval',
      autoRemoveInterval:1
   })
}))


app.route('/api/v1/ga')
   .post(googleAuth.googleAuthFirst)
app.route('/api/v1/auth')
   .get(googleAuth.googleAuthSecond)
app.route('/api/v1/auth/payload')
   .get(googleAuth.googleAuthLast)
app.route('/api/v1/clearuserdata')
   .get(googleAuth.clearUserData)


app.route('/api/v1/registeruser')
   .post(userController.registerUser)
app.route('/api/v1/islogged')
   .get(authController.protect,authController.haslogged)
app.route('/api/v1/logout')
   .get(googleAuth.logout)

app.route('/api/v1/posttweet')
   .post(postController.postTweet)
app.route('/api/v1/getpostdata')
   .get(postController.getPostData)
app.route('/api/v1/replypost')
   .post(postController.replyPost)
app.route('/api/v1/getcomments')
   .get(postController.getComments)
app.route('/api/v1/unlikepost')
   .delete(postController.removeLike)
app.route('/api/v1/likepost')
   .post(postController.likePost)
app.route('/api/v1/likecomment')
   .post(postController.likeComment)

app.listen(4000,()=>{
   console.log('app calisti');
})

