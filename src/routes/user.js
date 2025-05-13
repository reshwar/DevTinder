const express = require("express")
const { userAuth } = require("../middleware/auth")
const connectionRequestModel = require("../models/connectonRequest")
const user = require("../models/user")
const userRouter = express.Router()

const SAFE_DATA = 'firstname lastname emailId age gender skill about profileUrl'

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id

        const requestsReceived = await connectionRequestModel.find({ toUserId: loggedInUser, status: "interested" }).populate('fromUserId', SAFE_DATA)
        console.log("requestsReceived vall", requestsReceived)
        res.status(200).json({ "message": "retrieved requests", "data": requestsReceived })
    } catch (error) {
        res.status(400).json({ "message": "Bad request", "error": error.message })
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user
        const connectionsList = await connectionRequestModel.find({ $or: [{ status: "accepted", fromUserId: loggedinUser._id }, { status: "accepted", toUserId: loggedinUser._id }] }).populate('toUserId', SAFE_DATA).populate('fromUserId', SAFE_DATA)
        const connections = connectionsList.map((row) => {
            if (row.fromUserId._id.toString() === loggedinUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.status(200).json({ "data": connections })
    }
    catch (error) {
        res.json({ "message": error.message })
    }
})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const page = req.query.page
        const size = req.query.limit
        const skip = (page - 1)*size
        console.log("skip",skip)
        console.log("size",size)
        const loggedInUser = req.user
        const connectionsList = await connectionRequestModel.find({ $or: [{ toUserId: loggedInUser }, { fromUserId: loggedInUser }] }).select("toUserId").select("fromUserId")
        const nonUsers = new Set()
        connectionsList.forEach(element => {
            console.log("ele", element)
            nonUsers.add(element.toUserId)
            nonUsers.add(element.fromUserId)
        });
        console.log("Array.from(nonUsers) vall", Array.from(nonUsers))
        const feedUsers = await user.find(
            {
                $and: [
                    {
                        _id: { $nin: Array.from(nonUsers) }
                    },
                    {
                        _id: { $ne: loggedInUser._id }
                    }
                ]
            }).select(SAFE_DATA).skip(skip).limit(size)
        //find({ $or:[{ status: "accepted", fromUserId: loggedinUser._id }, { status: "accepted", toUserId: loggedinUser._id }]})

        console.log("nonUsers vall", feedUsers)

        res.status(200).json({ data: feedUsers })
    } catch (error) {
        res.json({ "message": error.message })
    }
})

module.exports = userRouter 