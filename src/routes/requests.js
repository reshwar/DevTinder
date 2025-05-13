const express = require('express')
const { userAuth } = require('../middleware/auth')
const connectionRequestModel = require('../models/connectonRequest')
const user = require('../models/user')

const requestRouter = express.Router()

requestRouter.post('/sendConnectionRequest/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const status = req.params.status
        const toUserId = req.params.toUserId
        const fromUserId = req.user._id
        const foundUser = await user.findOne({ _id: toUserId }).exec();
        if (!["interested", "ignored"].includes(status)) {
            return res.status(400).json({ "message": "Bad Request" })
        }
        if (!foundUser) {
            return res.status(400).json({ "message": "Bad Request" })
        }
        // console.log("founduser vall",foundUser)
        const isInvalidConnectionRequest = await connectionRequestModel.findOne({ $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }] })
        if (isInvalidConnectionRequest) {
            return res.status(400).json({ "message": "Invlid connection request" })
        }
        const connectionRequestData = connectionRequestModel({ status, toUserId, fromUserId })
        await connectionRequestData.save()
        res.json({ message: "Connection request sent", data: connectionRequestData })
    } catch (error) {
        console.log("Error vall" + error)
        res.status(400).json({ message: "ERROR", error })
    }
})

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const {status,requestId} = req.params
        const loggedInUser = req.user

        if (!['accepted', 'rejected'].includes(status)) {
            res.status(400).json({ "message": "Invalid status sent" })
        }
        const connectionRequestData = connectionRequestModel({ _id: requestId, toUserId:loggedInUser._id, status: "interested" })
        if (!connectionRequestData) {
            res.status(404).json("Connection request not found")
        }
        const data = await connectionRequestModel.findByIdAndUpdate(requestId,{status})
        // connectionRequestData.status = status
        // const data = await connectionRequestData.save()
        res.status(200).json({ "Message": "Connection reviewed succesfully", "data": data })
    } catch (error) {
        res.status(400).json({ message: "ERROR", error })
    }
})

module.exports = requestRouter