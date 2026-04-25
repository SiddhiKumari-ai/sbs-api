const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName : {type:String,required:true},
    phone :{type:String,required:true},
    email :{type:String,required:true},
    address : String,
    gender : String,
    password : {type:String,required:true}
})

module.exports = mongoose.model('user', userSchema)