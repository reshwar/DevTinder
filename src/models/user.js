const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
    },
    lastname:{
        type:String
    },
    emailId:{
        type:String
    },
     password:{
        type:String
     },
     age:{
        type:Number
     },
     gender:{
        type:String
     }

})

module.exports = mongoose.model("User",userSchema)