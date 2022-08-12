const router=require('express').Router()
const auth=require('../middleware/auth')
const Appointment=require('../models/appointments')
const Student=require('../models/student')
const Teacher=require('../models/teacher')


router.get('/book-appointment/:id',auth,async (req,res)=>
{
    try {
        const student=await Student.findById(req.student._id)
        const teacher=await Teacher.findById(req.params.id)
        const appointment=await Appointment.find({student:req.student._id})

        

        if(appointment.length!==0)
        {

        let student_appointments=[]

        for(let i=0;i<appointment.length;i++)
        {
            for(let j=0;j<appointment[i].slots.length;j++)
            {
                student_appointments.push(appointment[i].slots[j].slot)
            }
        }
        
        // console.log(student_appointments)
        
        let teacher_slots = teacher.slots;
        // console.log(teacher_slots)
        // let b=[ '09.00-10.00 a.m.' ]
        // let a=['09.00-10.00 a.m.','10.00-11.00 a.m.','11.00-12.00 p.m.']
        
        let allowed_appointments = teacher_slots.filter(function(item) { 
          return student_appointments.indexOf(item.time) < 0; // Returns true for items not found in b.
        })

        console.log(allowed_appointments)

        res.render('teacher',{
            teacher,
            student,
            allowed_appointments
        })
    }
    else
    {
        console.log('in else')
        res.render('teacher',{
            teacher,
            student,
        })
    }


    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/appointment/:id/:slot/:slotid',auth,async(req,res)=>
{
    try {

        const student=await Student.findById(req.student._id)
        const teacher=await Teacher.findById(req.params.id)
        const appointment=await Appointment.findOne({student:student._id,teacher:teacher._id})

        // const slot=teacher.slots[req.params.slot].time
        // console.log(slot)
        let slot;

        // console.log(teacher.slots[0]._id.toString())

        for(let i=0;i<teacher.slots.length;i++)
        {
            if(teacher.slots[i]._id==req.params.slotid)
            {
                slot=i
            }
        }
        console.log(slot)


        const send_slot= teacher.slots[slot].time
        
        if(!appointment)
        {
            const appointment=new Appointment({
                        student,
                        teacher,
                        slots:{slot:send_slot}
                        
                     })
            

            await appointment.save()
            await appointment.populate()
            const appStudent=await appointment.populate('teacher')
            await teacher.slots.splice([slot],1)
            await teacher.save()
            res.render('appointment_page',{
                student:appStudent.student,
                teacher:appStudent.teacher,
                slot:send_slot
            })

        }
        else
        {
            await appointment.slots.push({slot:send_slot})
            await appointment.save()

            await appointment.populate()
            const appStudent=await appointment.populate('teacher')
            await teacher.slots.splice([slot],1)
            await teacher.save()

         res.render('appointment_page',{
            student:appStudent.student,
            teacher:appStudent.teacher,
            slot:send_slot
        })

        }

    } catch (error) {
        res.status(400).send(error.message)
    }


})


router.get('/appointment/:id/:slot/',auth,async(req,res)=>
{
    try {

        const student=await Student.findById(req.student._id)
        const teacher=await Teacher.findById(req.params.id)

        const slot=teacher.slots[req.params.slot].time




               const appointment=new Appointment({
                   student,
                   teacher,
                   slots:{slot:slot}
                   
                })


                await appointment.save()
                await appointment.populate()
                const appStudent=await appointment.populate('teacher')
                await teacher.slots.splice([req.params.slot],1)
                await teacher.save()
                res.render('appointment_page',{
                    student:appStudent.student,
                    teacher:appStudent.teacher,
                    slot
                    })








        // const appointment=await Appointment.findOne({student:student._id,teacher:teacher._id})

        // const slot=teacher.slots[req.params.slot].time
        // console.log(slot)


        //     await appointment.slots.push({slot:slot})
        //     await appointment.save()

        //     await appointment.populate()
        //     const appStudent=await appointment.populate('teacher')
        //     await teacher.slots.splice([slot],1)
        //     await teacher.save()

        res.render('appointment_page',{
            student:appStudent.student,
            teacher:appStudent.teacher,
            slot
        })



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