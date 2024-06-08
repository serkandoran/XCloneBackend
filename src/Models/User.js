// user oluşturulunca idsini session id ver.

const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
   name:{
      type: String,
      required: [true, 'Please provide username']
   },
   email:{
      type: String,
      required: [true, 'Email is not valid'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
   },
   picture: String,
   bio: String,
   password: {
      type: String,
      minlength: 8
   },
   passwordConfirm:{
      type: String,
      validate:{
         validator: function(el){
            return this.password === el
         },
         message: 'passwords are not the same'
      }
   },
   locale:{
      type:String,
      default:"tr"
   },
   phoneNumber: {
      type:String,
      default:'notset'
   },
   birthDate: {
      type:String,
      default:'notset'
   }
})


const User = mongoose.model('users',userSchema)



module.exports = User






