const express = require('express')
const Router = express.Router()
const Contact = require('../model/Contact')


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


Router.post('/addcontact', async (req, res) => {
    try {
        // const newContact = new Contact({
        //     fullName: req.body.name,
        //     email: req.body.person_email,
        //     phone: req.body.person_phone,
        //     address: req.body.add
        // })
        const newContact = new Contact(req.body)
        await newContact.save()
        res.status(200).json({
            result: "Contact Saved"
        })
        console.log(newData)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Something is wrong"
        })
    }
})


// get all contact
Router.get('/all-contact', async (req, res) => {
    try {
        const allContact = await Contact.find()  // yaha Contact matlab schema wla h jo direct mongodb se connect ho rha.. usi se data fetch krenge...
        res.status(200).json({
            contacts: allContact
        })
    }
    catch (err) {
        console.loh(err)
        res.status(500).json({
            error: err
        })
    }
})


//get contact by id
Router.get('/contactById/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await Contact.findById(id).select("fullName address")
        res.status(200).json({
            contact: data
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
        const data = await Contact.find({gender:req.params.g})
        res.status(200).json({
            contact: data
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: "Something is wrong..."
        })
    }
})

//delete api by id
Router.delete('/:id',async(req,res)=>{
    try
    {
        await Contact.deleteOne({_id:req.params.id})
        res.status(200).json({
            msg : "Data deleted"
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

//delete many by particular category/ies
Router.delete('/byGender/:g',async(req,res)=>{
    try
    {
        await Contact.deleteMany({gender:req.params.g})
        res.status(200).json({
            msg:`All data from ${req.params.g} gender is deleted...`
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