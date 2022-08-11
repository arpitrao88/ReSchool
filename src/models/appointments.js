const mongoose=require('mongoose')


const appointmentSchema=new mongoose.Schema({
    student:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    teacher:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Teacher'
    },
    slots:[{
        slot:{
        type:String
        }
    }]
})

const Appointment=new mongoose.model('Appointment',appointmentSchema)

module.exports=Appointment