const express = require('express')
const Router = express.Router()
const bcrypt = require('bcrypt')
const User = require("../model/User")
const jwt = require('jsonwebtoken')


//signup api
Router.post('/signup', async(req,res)=>{
    try
    {
        const user = await User.find({email:req.body.email})
        if(user.length > 0)
        {
            return res.status(200).json({
                error:"email already registered..."
            })
        }
        const hash = await bcrypt.hash(req.body.password,10)
        console.log(hash)

        const newUser = new User({
            fullName : req.body.fullName,
            email : req.body.email,
            phone : req.body.phone,
            password : hash
        })

        //console.log(newUser)
        const result = await newUser.save()
        res.status(200).json({
            msg : "account created",
            data : {
            fullName : result.fullName,
            email : result.email,
            phone : result.phone 
            }
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


// login api
Router.post('/login',async(req,res)=>{
    try
    {
        const user = await User.find({email:req.body.email}) //array k andar ek object k form me ek data...
        console.log(user)
        if(user.length == 0)
        {
            return res.status(500).json({
                error:'email not registered....'
            })
        }

        const isMatch = await bcrypt.compare(req.body.password,user[0].password) //1st-> hash code wla password, 2nd-> frontend se jo normal formate me aa rha h wo password... 
        if(!isMatch)
        {
            return res.status(500).json({
                error:'invalid password'
            })
        }

        const appToken = await jwt.sign({
            userId:user[0]._id,
            fullName:user[0].fullName,
            email:user[0].email
        },
        'sbs ka app 123',
        {
            expiresIn:'24h'
        }
    )
     
    res.status(200).json({
        token:appToken
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