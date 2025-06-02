const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
var cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/initializeSocket");

require("./config/database");
const { validateSignUp } = require("./utils/validation");
//require('./config/database')
const connectDB = require("./config/database");
const user = require("./models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("./middleware/auth");
require("./utils/cron");

//const { adminAuth, userAuth } = require('./middleware/auth')
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

const server = http.createServer(app);
initializeSocket(server);
app.use(cookieParser());

app.use(express.json());

app.use(authRouter);
app.use(profileRouter);
app.use(requestRouter);
app.use(userRouter);
app.use(chatRouter);

connectDB()
  .then(() => {
    server.listen(4000, () => {
      console.log("server started");
    });
    console.log("connected DB");
  })
  .catch((err) => {
    console.log(err);
  });

// app.post('/profile', userAuth, async (req, res) => {
//     try {
//         res.send(req?.user)
//     } catch (error) {
//         res.send(error)
//     }
// })

// app.get('/fetchByEmail', async (req, res) => {
//     try {
//         const users = await user.find({ emailId: req.body.emailId })
//         res.send(users)
//     } catch (error) {
//         res.status.send("something went wrong")
//     }
// })

// app.get('/fetchById', async (req, res) => {
//     try {
//         const users = await user.findById("67bedfc0663fcde20a589722")
//         res.send(users)
//     } catch (error) {
//         res.status(400).send("Something went wrong")
//     }
// })

// app.get('/fetchOne', async (req, res) => {
//     try {
//         res.send(await user.findOne({ emailId: "e123@gmail.com" }))
//     } catch (error) {
//         res.status(400).send("something went wrong")
//     }
// })

// app.get('/fetchAll', async (req, res) => {
//     const allData = await user.find({})
//     res.send(allData)
// })

// app.post('/sendConnectionRequest', userAuth, (req, res) => {
//     try {
//         console.log("req vall", req)
//         res.send(req?.user?.firstname + "sent connection request")
//     } catch (error) {
//         console.log("Error vall" + error)
//         res.send(error)
//     }
// })

// app.patch('/update/:id', async (req, res) => {
//     try {
//         const id = req.params?.id
//         console.log("req.body vall", req.body)
//         console.log("id vall", id)
//         const payload = req.body
//         const allowedUpdates = ['firstname', 'lastname', 'password', 'age', 'gender', 'skill', 'emailId']
//         const isAllowUpdates = Object.keys(req.body).every((k) => allowedUpdates.includes(k))
//         if (!isAllowUpdates) {
//             throw new Error("Invlid update")
//         }
//         await user.findOneAndUpdate({ _id: id }, payload, { runValidators: true })
//         res.send("updated values")
//     } catch (error) {
//         console.log(error)
//         res.send("error in updating ")
//     }
// })

// app.post('/login', async (req, res) => {
//     try {
//         console.log("req from postman", req.body)
//         const { emailId, password } = req.body
//         //const userId = await user.findOne({ emailId })
//         const userRecord = await user.findOne({ emailId }).exec();

//         if (!userRecord) {
//             return res.status(401).send('Invalid Credentials')
//         }

//         const validPassword = await userRecord.isValidPassword(password)
//         if (!validPassword) {
//             return res.status(401).send('Invalid Credentials')
//         }
//         const token = await userRecord.getJWT()
//         res.cookie("token", token)
//         res.send("Login Successfull!!!")
//     } catch (error) {
//         res.status(400).send(error.message)
//     }
// })
