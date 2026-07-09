require('dotenv').config()
const express = require('express')
const Router = express.Router()
const Contact = require('../model/Contact')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2




cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


//addcontact
// Router.post('/addcontact',(req,res)=>{
//     console.log(req.body)
//     const newContact = new Contact({
//         fullName : req.body.name,
//         email : req.body.person_email,
//         phone : req.body.person_phone,
//         address : req.body.add   
//     })

//     newContact.save()
//     .then(()=>{
//         console.log('Data Saved')
//         res.status(200).json({
//             msg : "Data Saved"
//         })
//     })
//     .catch((err)=>{
//         console.log(err)
//         res._construct(500).json({
//             error : 'Something is wrong'
//         })
//     })
// })


Router.post('/add-contact', async (req, res) => {
    try {

        //console.log(req)
        //console.log(req.header.authorization.split(" ")[1]) // array k 2nd element me token milega...

        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SEC_KEY)
        //console.log(tokenData)

        const uploadedResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
        //console.log(uploadedResult)
        const newContact = new Contact({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            gender: req.body.gender,
            userId: tokenData.userId,
            imageId: uploadedResult.public_id,
            imageUrl: uploadedResult.secure_url
        })
        //console.log(newContact)
        // const newContact = new Contact(req.body)
        const newData = await newContact.save()
        //console.log(newData)
        res.status(200).json({
            result: newData
        })
        //console.log(newData)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})


// get all contact
Router.get('/all-contact', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SEC_KEY)
        const allContact = await Contact.find({ userId: tokenData.userId }).select("_id fullName email phone address gender userId imageUrl").populate('userId', "-password")
        res.status(200).json({
            contacts: allContact
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})


//get contact by id
Router.get('/contactById/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SEC_KEY)
        const id = req.params.id
        //const data = await Contact.findById(id).select("fullName address")
        const data = await Contact.find({ _id: req.params.id, userId: tokenData.userId }) // yaha Contact matlab schema wla h jo direct mongodb se connect ho rha.. usi se data fetch krenge...
        return res.status(200).json({
            contact: data.length > 0 ? data[0] : {}
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})

//get contact by gender
Router.get('/gender/:g', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SEC_KEY)
        const contact = await Contact.find({ gender: req.params.g, userId: tokenData.userId })
        res.status(200).json({
            contact: contact
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})

//delete api by id
Router.delete('/:id', async (req, res) => {
    try {
        // const token = req.headers.authorization.split(" ")[1]
        // const tokenData = await jwt.verify(token, process.env.SEC_KEY)
        // await Contact.deleteOne({ _id: req.params.id, userId: tokenData.userId })
        // res.status(200).json({
        //     msg: "Data deleted"
        // })

        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SEC_KEY)
        const contact = await Contact.findById(req.params.id)
        if (contact.userId != tokenData.userId) {
            return res.status(500).json({
                error: 'invlaid user'
            })
        }

        await cloudinary.uploader.destroy(contact.imageId)
        await Contact.deleteOne({ _id: contact._id })
        res.status(200).json({
            msg: 'data deleted'
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})

//delete many by particular category
Router.delete('/byGender/:g', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SEC_KEY)
        await Contact.deleteMany({ gender: req.params.g, userId: tokenData.userId })
        res.status(200).json({
            msg: `All data from ${req.params.g} gender is deleted...`
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})



//update by id
Router.put('/update/:id', async (req, res) => {
    try {
        //console.log(req.body)
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SEC_KEY)
        const contactData = await Contact.findById(req.params.id)

        if (contactData.userId != tokenData.userId) {
            return res.status(500).json({
                msg: "u can't update this  data..."
            })
        }

        const newData = ({
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            gender: req.body.gender,
            userId: req.body.userId,
            imageId: contactData.imageId,
            imageUrl: contactData.imageUrl
        })
        // newData["imageId"] = contactData.imageId
        // newtData["imageUrl"] = contactData.imageUrl

        if (req.files) {
            await cloudinary.uploader.destroy(contactData.imageId)
            //const uploadedResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
            const uploadedResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
            newData["imageId"] = uploadedResult.public_id
            newData["imageUrl"] = uploadedResult.secure_url
        }


        //console.log(newData)
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, newData, { new: true })
        res.status(200).json({
            updatedContact: updatedContact
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "data can't be updated...",
            error: err
        })
    }
})

//count contact
Router.get('/count',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SEC_KEY) 

        const count = await Contact.countDocuments({userId:tokenData.userId})
        res.status(200).json({
            count:count
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


module.exports = Router