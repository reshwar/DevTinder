const express = require('express')
const { userAuth } = require('../middleware/auth')
const { validateEditProfile } = require('../utils/validation')
const user = require('../models/user')
const bcrypt = require('bcrypt');
const profileRouter = express.Router()

profileRouter.post('/profile/view', userAuth, async (req, res) => {
    try {
        res.send(req?.user)
    } catch (error) {
        res.status(401).send(error)
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfile(req)) { throw new Error("Invalid request") }
        let loggedInUser = req.user
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key]
        })
        await loggedInUser.save()
        res.send(loggedInUser)
    } catch (error) {
        res.status(400).send(error)
    }
})

profileRouter.patch('/profile/forgotPassword', async (req, res) => {
    try {
        const { emailId, password } = req.body
        const foundEmailId = await user.findOne({ emailId }).exec();
        if (!foundEmailId) {
             throw new Error("Invalid EmailId!!")
        } else {
            const passwordHash = bcrypt.hashSync(password, 10);
            await user.findOneAndUpdate({ emailId: emailId }, { password: passwordHash })
            res.send("Updated password!!!")
        }
    }
    catch (error) {
        return res.status(400).send(error.message)
    }
})

module.exports = profileRouter