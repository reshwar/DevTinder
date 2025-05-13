const mongoose = require("mongoose")
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,"firstName is required"],
        trim:true
    },
    lastname:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        unique:true,
        lowercase:true,
        // validate: {
        //     validator: function(v) {
        //         return validator.isEmail(v); 
        //     },
        //     message: props => `${props.value} is not a valid email`
        //   },
    },
     password:{
        type:String,
        required:true,
        minLength:1,
        maxlength:90
     },
     age:{
        type:Number,
     },
     gender:{
        type:String,
        validate: {
            validator: function(v) {
              return ["male","female"].includes(v)
            },
            message: props => `${props.value} is not a valid gender`
          },
     },
     skill:{
        type:String,
        default: "Javascript"
     },
     about:{
        type:String,
        default:"You are magic!!!!"
     },
     profileUrl:{
        type:String,
        default:"www.profile.com"
     }

},{ timestamps: true })

userSchema.methods.getJWT = async function(){
    const user = this
    let token = await jwt.sign({ _id: user._id.toHexString() }, "devqwer", { expiresIn: '1d' });
    return token
}

userSchema.methods.isValidPassword = async function (passwordFromUser) {
    const user = this
    const isValidPassword = await bcrypt.compare(passwordFromUser, user.password)
    return isValidPassword
    // if (!isValidPassword) {
    //     return res.status(401).send('Invalid Credentials')
    // }
}

module.exports = mongoose.model("users",userSchema)