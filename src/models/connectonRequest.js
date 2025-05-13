const { mongoose, Schema } = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
    {
        toUserId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref:"users"
        },
        fromUserId: {
            type: Schema.Types.ObjectId,
           // required: true,
            ref:"users"
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: "{VALUE} is incorrect status tyep"
            },
            required: true
        }
    },
    {
        timestamps: true
    })
    connectionRequestSchema.pre('save',function (next){
        const user = this
        let err
        if(user.toUserId.equals(user.fromUserId)){
             err =  new Error("Cannot send request to yourself")
        }
        next(err)
    })


const connectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = connectionRequestModel