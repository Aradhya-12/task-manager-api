// file to create model of users
const mongoose = require('mongoose')
const validator  = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./task.js')

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        trim : true,
        required : true
    },
    email :{
        type :String,
        unique : true,
        trim : true,
        lowercase : true,
        required :true,
        validate(value){
            if(!(validator.isEmail(value))){
                throw new Error("Invalid email")
            }
        }
    },
    password:{
        type : String,
        required : true,
        trim : true,
        validate(value){
            if(value.length < 6){
                throw new Error("Password must be of atleast size 6")
            }
            if(value.toLowerCase().includes("password")){
                throw new Error("password must not contain string - 'password'")
            }
        }
    },
    age:{
        type : Number,
        default :0,
        validate(value){
            if(value<0){
                throw new Error("Age must be positive")
            }
        }
    },
    tokens:[{
        token:{
            type : String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true 
})

userSchema.virtual('tasks',{
    ref : 'Tasks', // tasks 's refernce but not actually stored in db
    localField: '_id', //the field which is locally stored which in this case is obj's id
    foreignField: 'owner' //Creates a virtual type with the given name.
})

// toJSON() method definition
userSchema.methods.toJSON = function() {
    const user =this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

// methods are also called instance methods , names must be same
userSchema.methods.generateAuthToken = async function() {
    const user =this
    const token = jwt.sign({ _id : user._id.toString() }, process.env.JSON_TOKEN) // generating token for user of given id
    user.tokens = user.tokens.concat({token}) // adding that token to user's attributes
    await user.save() //saving user's data in database
    return token 
}


//statics are also called model methods , names must be same
userSchema.statics.findByCredentials = async (email, password) =>{
    const user1 = await user.findOne({email})
    if(!user1){
        throw new Error("Un able to login")
    }
    const isPasswordMatch = await bcrypt.compare(password , user1.password) 
    if(!isPasswordMatch){
        throw new Error("Unable to login")
    }
    return user1
}

// using a middleware to perform a standard func before saving user data
userSchema.pre('save' ,async function (next) {
    const user = this
    if(user.isModified('password')){
     user.password = await bcrypt.hash(user.password , 8) //.hash() returns a promise taking two inpts , the second one being the no. of times the hashing has to be done on the key
    }
    next() // for iterating the users in database
})

// middleware to delete all the tasks immeadiatey after user deletes his account
userSchema.pre('remove' , async function(next) {
    const user =this
    await Tasks.deleteMany({owner : user._id})
    next()
})

const user = mongoose.model('User' , userSchema)

module.exports = user
