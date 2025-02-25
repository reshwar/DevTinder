const adminAuth = (req,res,next)=>{
    let token = "xwyz"
        if(token !== "xyz"){
            res.status(403).send("not authorised")
        }else{
            next()
        }    
    }

const userAuth = (req,res,next)=>{
    let token = "xyz"
        if(token !== "xyz"){
            res.status(403).send("not authorised")
        }else{
            next()
        }    
    }
module.exports = {adminAuth,userAuth}