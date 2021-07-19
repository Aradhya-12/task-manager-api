const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
// creating a new user router
const router = new express.Router()

const upload = multer({
    limits:{
        fileSize: 1000000 //1Mb
    },
    fileFilter(req, file , callback) {
        if(!(file.originalname.match(/\.(jpeg|png|jpg)$/)))
        return callback(new Error('File must be either JPEG or PNG or JPG  format'))
        callback(undefined ,true)
    }
})

// to upload profile pic
router.post('/user/me/avatar' ,auth, upload.single('avatar'), async (req, res) =>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()   
},(error, req, res ,next) =>{
    res.status(404).send({error: error.message});
})

//to delete user's profile pic
router.delete('/user/me/avatar', auth ,async(req, res) =>{
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(404).send(e)
    }
})

//to create http req for users ans making callback func as async func
router.post('/users',async (req , res ) =>{
    const user1 = new User(req.body)
    try{
        await user1.save()
        const token = await user1.generateAuthToken() // to generate auth token for user immediately as he signs up
        res.send({user1,token})
    } 
    catch(e){
        res.status(400).send(e) //promise chaining + changing the staus of response
    }
})

//to login user's acc
router.post('/users/login', async (req,res) =>{
    try{
        const user1 = await User.findByCredentials(req.body.email , req.body.password) 
        const token = await user1.generateAuthToken() //to generate authentication tokens for user1
        res.send({user1 , token})
    }
    catch(e){
        res.status(404).send(e)
    }
})

//to log out from user's acc
router.post('/user/logout',auth, async (req, res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token != req.token
        })
        await req.user.save()
        res.send("logged out successfully")
    }
    catch(e){
        res.status(404).send()
    }

})

//to logout from all the sessions of acc
router.post('/user/logoutall', auth , async (req, res) =>{
    req.user.tokens.splice(0, req.user.tokens.length)
    try{
        await req.user.save()
        res.send("logged out successfully from all sessions")
    }
    catch(e){
        res.status(404).send()
    }
})

// to read infos of the user's profile  in database
router.get('/users/me', auth ,async (req,res) =>{ 
    res.send(req.user)
})

//updating user's details 
router.patch('/users/updateme',auth, async (req,res) =>{
    const update = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isvalidUpdate = update.every((updat) => allowedUpdates.includes(updat))
    if(!isvalidUpdate){
        return res.status(404).send("Invalid Updates")
    }
    try{
        
        update.forEach((updat) => req.user[updat] = req.body[updat]) // updating user's data acc to given updates using bracket notation
        // saving data
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.status(404).send(e)
    }
})

// deleting a user of particular id 
router.delete('/users/me', auth , async(req, res) =>{
    
    try{
        await req.user.remove()
        res.send(req.user)
    }
    catch(e){
        res.status(404).send(e)
    }

})

module.exports = router
