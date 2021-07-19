const jwt = require('jsonwebtoken')
const user = require('../models/user')

const auth = async (req, res, next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ' ,'')
        const decodeToken = jwt.verify(token , process.env.JSON_TOKEN)
        const user1 = await user.findOne({_id: decodeToken._id , 'tokens.token': token})
        if(!user1){
            throw new Error()
        }
        req.token = token
        req.user = user1 //in order to provide user1 to work with other routes we add new property eith req as user 
        next()
    }catch(e){
        res.status(401).send("Please Authenticate")
    }
}
module.exports=auth