const express=require('express')
require('./db/mongoose')
const app=express()
const studentRouter=require('./Router/student')
const path=require('path')
const teacherRouter=require('./Router/Teacher')
const hbs=require('hbs')
const bodyParser=require('body-parser')
const cookieParser = require("cookie-parser");


app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());






const templatePath=path.join(__dirname,'./templates/views')
const partialsPath=path.join(__dirname,'./templates/partials')

console.log(templatePath)
console.log(partialsPath)

app.set('view engine','hbs')
app.set('views',templatePath)
hbs.registerPartials(partialsPath)

app.use(express.static('public'))


app.use(studentRouter)
app.use(teacherRouter)





app.listen(3000,()=>
{
    console.log('Server is running on port 3000')
})