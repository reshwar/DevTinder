const jwt = require("jsonwebtoken")
const User = require('../models/user')

const adminAuth = (req, res, next) => {
    let token = "xwyz"
    if (token !== "xyz") {
        res.status(403).send("not authorised")
    } else {
        next()
    }
}

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        // if (!token) {
        //     return res.status(401).send("Authentication token is missing");
        // }
        const userId = jwt.verify(token, 'devqwer')
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("Invalid token")
        }
        req.user = user
        console.log("req.user",req.user)
        next()
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).send("Invalid or expired token");
        }
        res.status(500).send(error.message);
    }
}



module.exports = { adminAuth, userAuth }