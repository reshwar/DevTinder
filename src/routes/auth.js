const express = require('express')
const { validateSignUp } = require('../utils/validation')
const authRouter = express.Router()
const user = require('../models/user')
const bcrypt = require('bcrypt');
//const { set } = require('mongoose');

authRouter.post('/signUp', async (req, res) => {
    try {
        console.log("req from postman", req.body)
        const { firstname, lastname, emailId, age, gender, password } = req.body
        const passwordHash = bcrypt.hashSync(password, 10);
        validateSignUp(req)
        const schema = new user({ firstname, lastname, emailId, age, gender, password: passwordHash })
        const resp = await schema.save()
        console.log("resp from postman", resp)
        const token = await resp.getJWT()
        res.cookie("token", token)
        res.json({data:resp})

        //res.send("saved data to database")
    } catch (error) {
        console.log("error here", error)
        res.status(400).send(error.message)
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        console.log("req from postman", req.body)
        const { emailId, password } = req.body
        //const userId = await user.findOne({ emailId })
        const userRecord = await user.findOne({ emailId }).exec();

        if (!userRecord) {
            return res.status(401).send('Invalid Credentials')
        }

        const validPassword = await userRecord.isValidPassword(password)
        if (!validPassword) {
            return res.status(401).send('Invalid Credentials')
        }
        const token = await userRecord.getJWT()
        res.cookie("token", token)
        res.json({data:userRecord})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

authRouter.get('/logout', async (req, res) => {
    res.clearCookie("token")
    res.send("logged out suceesfully")
})



module.exports = authRouter