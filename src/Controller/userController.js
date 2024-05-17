const User = require('../Models/User.js')




exports.registerUser = async (req, res) => {
   try{
      let { name, email, picture, locale, birthDate, phoneNumber } = req.body
      let user = await User.create({
         name,
         email,
         picture,
         locale,
         birthDate,
         phoneNumber
      })
      req.session.userId = user._id
      res.status(201).json({
         data: user,
         msg: 'basarili'
      })
   }catch(err){
      res.status(500).json({
         msg: 'Sunucu hatası.'
      })
   }
}






