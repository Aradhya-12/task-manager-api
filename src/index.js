const express = require('express')
const User = require('./models/user.js')
const routerTask = require('./routers/tasks.js')
const routerUser = require('./routers/users.js')
const path = require('path')
// to connect our file to database and set up database 
require('./mongoose.js')

const app = express()

const port = process.env.PORT 

const staticDataDirectory= path.join(__dirname, '../templates')

// loading static files like css,js,html etc
app.use(express.static(staticDataDirectory))

//express turns our incoming json request into json object
app.use(express.json())

// assinging the users and tasks router to our express app
app.use(routerUser)
app.use(routerTask)

//jwt.sign() - returns token here in this case authentication token

app.listen(port , () =>{
    console.log("app is up and running on port!!", port)
})
