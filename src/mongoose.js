// include mongoose library
const mongoose = require('mongoose')

//as monggose is connecion btw node and our mongodb it's methods are much silimar to mongodb

//connect database (task-manager-api) and our localhost

mongoose.connect(process.env.MONGO1_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    useCreateIndex : true // tell mongoose to create indices for collections to easily access its doc
})


