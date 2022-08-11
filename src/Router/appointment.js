const router=require('express').Router()
const auth=require('../middleware/auth')
const Appointment=require('../models/appointments')
const Student=require('../models/student')
const Teacher=require('../models/teacher')


router.get('/appointment/:id/:slot',auth,async(req,res)=>
{
    try {

        const student=await Student.findById(req.student._id)
        const teacher=await Teacher.findById(req.params.id)
        const appointment=await Appointment.findOne({student:student._id,teacher:teacher._id})

        const slot=teacher.slots[req.params.slot].time
        console.log(slot)

        if(!appointment)
        {
            const appointment=new Appointment({
                        student,
                        teacher,
                        slots:{slot:slot}
                        
                     })
            // await appointment.slots.push(slot)

            await appointment.save()
            await appointment.populate()
            const appStudent=await appointment.populate('teacher')
            res.render('appointment_page',{
                student:appStudent.student,
                teacher:appStudent.teacher,
                slot
            })

        }
        else
        {
            await appointment.slots.push({slot:slot})
            await appointment.save()

        await appointment.populate()
        const appStudent=await appointment.populate('teacher')
        // console.log(appStudent.student)
        // console.log(appStudent.teacher)

        res.render('appointment_page',{
            student:appStudent.student,
            teacher:appStudent.teacher,
            slot
        })

        }

    } catch (error) {
        res.status(400).send(error.message)
    }


})
router.get('/appointments',auth,async(req,res)=>
{
    try {
            const student=await Student.findById(req.student._id)
            const appointments=await Appointment.find({student:req.student._id})
            // const student=await Student.findById(req.student._id)
            const arr=[]
            // const slots=[]
            // appointments.forEach(async (element)=> {
            //         const newElement=await element.populate('teacher')
            //         arr.push(newElement)


            // });

            // const newArr= appointments.map(async (element)=>
            // {
            //      await element.populate('teacher')
            // })

            // console.log(newArr)


            for(var i=0;i<appointments.length;i++)
            {
                arr.push(await appointments[i].populate('teacher'))
            }




            







             res.render('appointments',
             {
                 student,
                 arr,

             })


        // const student=await Student.findById(req.student._id)

            // const teacher=await Teacher.findById(student.teacher)
            // student.populate('teacher')
            // console.log(student);
            
            // const time=student.slot
            // console.log(time);
            




    } catch (error) {
        res.status(400).send(error.message)
    }
})








module.exports=router