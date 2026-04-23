const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName : String,
    phone : String,
    email : String,
    address : String,
    gender : String,
    password : String
})

module.exports = mongoose.model('user', userSchema)