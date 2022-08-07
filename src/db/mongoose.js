const mongoose=require('mongoose')


mongoose.connect('mongodb://localhost:27017/reschool',{
    useNewUrlParser:true}).then(()=>console.log('Connected to db'))