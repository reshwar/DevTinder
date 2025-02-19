const express = require('express')
const app = express()

app.use("/",(req,res)=>{
    res.send("qwertyqaqa")
})

app.use("/hi",(req,res)=>{
    res.send("wwwdddw")
})

app.listen(3000,()=>{
    console.log("server started")
})