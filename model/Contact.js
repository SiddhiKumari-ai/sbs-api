const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    fullName : String,
    phone : String,
    email : String,
    address : String,
    gender : String,
    userId : String,
    imageId : String,
    imageUrl : String
})

module.exports = mongoose.model('contact', contactSchema)