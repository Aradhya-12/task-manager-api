// creating model of tasks having folling fields
const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    desc :{
        type : String,
        trim : true,
        required : true
    },
    status : {
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId, // data at owner will be of type objectid
        required: true,
        ref : 'User' //creates a reference of User model must be same as modle in user.js
    }
},{
    timestamps: true
})

const tasks = mongoose.model('Tasks' , taskSchema)

module.exports = tasks

