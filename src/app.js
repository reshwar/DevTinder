const express = require('express')
require('./config/database')
//require('./config/database')
const connectDB = require('./config/database')
const user = require('./models/user')
//const { adminAuth, userAuth } = require('./middleware/auth')
const app = express()

app.post('/signUp',(req,res)=>{
    const schema = new user({
        firstname:"Eshwar",
        lastname:"Ravikanti",
        password:"password",
        age:234,
        gender:"gender"
    })
    schema.save()
res.send("saved data to database")
})


connectDB().
    then(() => {
        app.listen(4000, () => {
            console.log("server started")
        })
        console.log("connected DB")
    })
    .catch((err) => {
        console.log(err)
    })
  


