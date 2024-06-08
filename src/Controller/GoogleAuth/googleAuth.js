
const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const User = require('../../Models/User.js')


let userData

exports.googleAuthFirst = async(req, res)=>{
   //  /api/v1/ga
   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
   res.header('Referrer-Policy', 'no-referrer-when-downgrade')



   const client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'http://localhost:4000/api/v1/auth'
   )
   const authorizedUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email',
      prompt: 'consent'
   })
   res.status(200).json({
      url: authorizedUrl,
   })
}

exports.googleAuthSecond = async(req, res)=>{
   // /api/v1/auth
   const code = req.query.code
   const client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'http://localhost:4000/api/v1/auth'
   )
   const response = await client.getToken(code)
   await client.setCredentials(response.tokens)
   const user = await client.credentials
   let payload
   try {
      const ticket = await client.verifyIdToken({
         idToken: user.id_token,
         audience: process.env.CLIENT_ID
      });
      payload = await ticket.getPayload()
   } catch (err) {
      if (err) {
         return res.redirect('/Basarisiz giris')
      }
   }
   userData = payload
   res.redirect('http://localhost:3000/basari')
}

exports.clearUserData = (req,res)=>{
   userData = undefined
   res.status(200).json({
      msg: 'basarili'
   })
}

exports.googleAuthLast = async(req,res)=>{
   // /api/v1/auth/payload
   if(userData){ // user google ile ilk kez giriş yapıyor.
      let user = await User.findOne({email: userData.email})

      if(user && !req.session.userId){ // user kayıtlı ama sessionu bitmiş
         req.session.userId = user._id
         return res.status(200).json({data: userData, isUser: true})
      }else if(!user){
         let user = await User.create({
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
         })
         req.session.userId = user._id
         res.status(200).json({data:user, isUser:false})
      }
   } else return res.status(403).json({msg:'hatalı giriş'})
   // if(userData){
   //    return res.status(200).json({
   //       data: userData,
   //       isUser: false
   //    })
   // }else return res.status(403).json({})
}

exports.logout = async (req, res) => {
   req.session.destroy(err => {
      if (err) {
         return res.status(500).json({
            msg: 'logout failed'
         })
      }
      res.clearCookie('connect-session')
      userData = undefined
      res.status(200).json({
         msg: 'logout success'
      })
   })
}




