const express = require('express')
const tasks = require('../models/task.js')
const auth = require('../middleware/auth')
const router = new express.Router()

// to create http req. for tasks
router.post('/task', auth , async (req ,res) =>{
    const task1 = new tasks({
        ...req.body, // using es6 spread operator for copying the tasks body and then spicifying the user's id in owner
         owner : req.user._id})
    try{
        await task1.save()
        res.status(201).send(task1)
    }
    catch(e){
        res.status(401).send(e)
    }
})

// to read infos of all the tasks in database that authenicated user created
// /GET/task?sortBy=createdAt:desc
router.get('/task', auth , async (req,res) =>{
    const match ={} //if no query is issued then all the tasks will be displayed else only filtered tasks will be displayed
    const sort= {}
    if(req.query.status){
        match.status = req.query.status === 'true'
    }

    if(req.query.sortBy){
        const part = req.query.sortBy.split(':')
        sort[part[0]] = part[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
        path : 'tasks',
        match,
        options:{
            limit : parseInt(req.query.limit), //pagination as whatever we enter goes as string so we need to connvert it to int type
            skip: parseInt(req.query.skip),
            sort // sorting data
        }}).execPopulate()
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(401).send(e)
    }
})

// to read info of particular task eg by id
router.get('/task/:id' , auth , async (req, res)=>{
    //in order to access the dynamic parameters(eg: id) of route
    const _id = req.params.id

    //mongoose itself converts the string ids to object ids
    try{
        const task = await tasks.findOne({_id, owner : req.user._id})  // this finds tasks by id and only those tasks which the authentcated user has only created
        //if task not found
        if(!task)
        return res.status(404).send("task not found")
        res.send(task)  //else task data
    }
    catch(e){
        res.status(401).send(e)
    }
})

//updating task's details by id
router.patch('/task/:id', auth , async (req,res) =>{
    const _id = req.params.id
    const update = Object.keys(req.body)
    const allowedUpdates = ['desc','status']
    const isvalidUpdate = update.every((updat) => allowedUpdates.includes(updat))
    if(!isvalidUpdate){
        return res.status(404).send("Invalid Updates")
    }
    try{
        const task1 = await tasks.findOne({_id, owner : req.user._id})
         //if task not found
        if(!task1)
        return res.status(404).send("task not found")
        update.forEach((updat) => task1[updat] = req.body[updat])
        await task1.save()
        res.send(task1)
    }
    catch(e){
        res.status(404).send(e)
    }
}) 

// deleting a task of particular id 
router.delete('/task/:id', auth ,  async(req, res) =>{
    const _id = req.params.id
    try{
        const deletedTask = await tasks.findOneAndDelete({_id,owner : req.user._id})
        if(!deletedTask){
            return res.status(404).send("Task not found")
        }
        res.send(deletedTask)
    }
    catch(e){
        res.status(404).send(e)
    }

})
module.exports = router 