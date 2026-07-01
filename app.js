require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const userRouter = require('./Routes/user')
const contactRouter = require('./Routes/contact')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

// mongoose.connect(process.env.MONGODB_URL)
// .then(()=>{
//     console.log("connected to database")
// })
// .catch((err)=>{
//     console.log("Something is wrong")
//     console.log(err)
// })




const connectwithdatabase = async()=>{
    try
    {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected with Database")
    }
    catch(err)
    {
        console.log(err)
        console.log("Something is wrong")
    }
}

connectwithdatabase()
app.use(cors());

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/user',userRouter)
app.use('/contact',contactRouter)

module.exports = app 