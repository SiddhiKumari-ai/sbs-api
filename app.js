const express = require('express')
const app = express()
const userRouter = require('./Routes/user')
const contactRouter = require('./Routes/contact')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// mongoose.connect('mongodb+srv://Sidd:ss1234@sbs.truwirp.mongodb.net/?appName=SBS')
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
        await mongoose.connect('mongodb+srv://Sidd:ss1234@sbs.truwirp.mongodb.net/?appName=SBS')
        console.log("Connected to Database")
    }
    catch(err)
    {
        console.log(err)
        console.log("Something is wrong")
    }
}

connectwithdatabase()


app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/user',userRouter)
app.use('/contact',contactRouter)

module.exports = app 