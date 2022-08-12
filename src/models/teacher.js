const mongoose=require('mongoose')
const validator=require('validator')



const teacherSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    subject:
    {
        type:String,
        required:true,

    },
    email:
    {
        type:String,
        unique:true,
        trim:true,
        required:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Email is Invalid')
            }
        }
    },
    availability:
    {
        type:Boolean,
        required:true,
        default:true
    },
    slots:[{
        time:
        {
            type:String,
            unique:true,
            // validate(value)
            // {
            //         const check=teacherSchema.slots.every((element)=> element===value)
            //         if(check)
            //         {
            //             throw new Error('Same Slot')
            //         }
            // }
        }
    }]
})


const Teacher=new mongoose.model('Teacher',teacherSchema)

module.exports=Teacher

