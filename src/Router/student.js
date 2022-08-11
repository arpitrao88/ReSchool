const router=require('express').Router()
const Student=require('../models/student')
const Teacher=require('../models/teacher')
const Appointment=require('../models/appointments')
const auth=require('../middleware/auth')


router.post('/',(req,res)=>
{
    res.send(req.body.email)
})

router.get('/sign-up',(req,res)=>
{
    res.render('sign-up-page')
})

router.post('/post',async (req,res)=>
{
    // console.log(req.body.name)
    try{
        console.log(req.body);
        
        // const teacher=await Teacher.findOne({name:req.body.name})
    // console.log(teacher)
    //  res.status(201).send(JSON.stringify(teacher))

    }
    catch(error)
    {
        console.log(error);
    }
})

router.post('/student-sign-up',async (req,res)=>
{

    try
    {

        const student=new Student(req.body)

        await student.save()
        // const token=await student.generateAuthToken()   
        // // student.tokens.push(token)
        // student.tokens.push({token})

    
        // await student.save()
        // const teacher=await Teacher.find({availability:true})
        // res.render('index',
        // {
        //    student,
        //    teacher 
        // })
        res.redirect('/')
    }
    catch(error)
    {
        res.status(400).send(error)
    }

})
router.post('/student-login',async (req,res)=>
{
    try{
        
        const student=await Student.findByCredentials(req.body.email,req.body.password)
        const token=await student.generateAuthToken();
        // student.tokens=student.tokens.concat({token:token})
        student.tokens.push({token})
        await student.save();
        res.cookie("jwtoken",token)
        
        res.redirect('/home')
      
    }
    catch(error)
    {
        res.status(400).send(error.message)
        
    }
})

router.get('/book-appointment/:id',auth,async (req,res)=>
{
    try {
        const student=await Student.findById(req.student._id)
        const teacher=await Teacher.findById(req.params.id)
        const appointment=await Appointment.find({student:req.student._id})
        // console.log(teacher)
        // console.log(appointment.length)
        // console.log(appointment)

        // console.log(appointment)
        const arr=[]

       for(var i=0;i<appointment.length;i++)
       {
            for(var j=0;j<appointment[i].slots.length;j++)
            {
                arr.push(appointment[i].slots[j].slot);
                
            }
       }
       
       console.log(teacher.slots)
       console.log(arr)

        // const newArr=arr.filter((e)=>
        // {
        //     return teacher.slots.time!=e
        // })

        const newArr=[]

        for(var i=0;i<teacher.slots;i++)
        {
                for(var j=0;j<arr.length;i++)
                {
                    if(teacher.slots[i].time!==arr[j])
                    {
                        newArr.push(teacher.slots[i].time)
                    }
                }
        }


        console.log(newArr);
        
 
        // if(appointment.length!==0)
        // {
            
        // const appointment_slots=[...appointment[0].slots]
        // const teacher_slots=teacher.slots
        
        // // console.log(appointment_slots)
        // // console.log(teacher_slots)

        // for(var i=0;i<teacher_slots.length;i++)
        // {
        //     for(var j=0;j<appointment_slots.length;j++)
        //     {
        //         if(teacher_slots[i].time==appointment_slots[j].slot)
        //          {
        //             teacher_slots.splice(i,1)
        //          }
        //     }
        // }
        // await teacher.save()
        // const available=teacher_slots
        // console.log(available);
        

        // res.render('teacher',{
        //     teacher,
        //     student,
        //     available
        // })

        // }
        // else
        // {

        res.render('teacher',{
            teacher,
            student,
        })

        // }




        
        // res.render('teacher',{
        //     teacher,
        //     student,
        // })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/home',auth,async (req,res)=>
{
    try{


        const teacher=await Teacher.find()
        // const teacher=await Teacher.find()
        // // console.log(teacher.teacher);
        // const teacherwithno=teacher.filter((teacher)=>teacher.slots.length==0)
        // console.log(teacherwithno)
        // teacherwithno.forEach(teacher => {
        //     teacher.availability=false
        // });        
        // await teacher.save()
        // console.log(teacher)
        if(teacher.length==0)
        {
            res.render('index',{
                teachermsg:'Sorry!, There Are No Teachers Available At The Moment'
            })

        }
        res.render('index',
        {
            teacher,
            student:req.student

        })
    }
    catch(error)
    {
        res.status(400).send(error.message)
    }
})


router.get('/logout',auth,async (req,res)=>
{   

        req.student.tokens=req.student.tokens.filter((token)=>
        {
            return token.token!==req.token
        })

        await req.student.save()

        res.cookie('jwtoken')

        res.redirect('/')

})
router.get('/student-logoutall',auth,async (req,res)=>
{   

        req.student.tokens=[]

        await req.student.save()
        
        res.send('Logged Out')

})



router.get('/students',auth,async(req,res)=>
{
    const teacher=await Teacher.find({availability:true})
    // res.send(teacher)
    res.render('index',{
        teacher:teacher
    })

})

router.get('/select-teacher/:id/:slot',auth,async function (req,res)
{
    try{
        // console.log(req.params.id)
        console.log('START-----'+req.params.slot)
        const teacher=await Teacher.findOne({_id:req.params.id,availability:true})
        // console.log(teacher)
        // // console.log(req.params.student)
        if(!teacher)
        {
            // res.status(400).send({message:"Teacher is not available"})
            return console.log('no teacher')
        }
        // teacher.availability=false;

     
        const student=await Student.findOne({_id:req.student._id})
        // console.log(student)
        // console.log('2-----'+teacher.slots[req.params.slot].time);
        const slotmsg=teacher.slots[req.params.slot].time;
        
        student.teacher=teacher
        // student.slot=teacher.slots[req.params.slot]
        student.slots.push({slot:teacher.slots[req.params.slot].time})
        // console.log(student)
        await student.save()
        // console.log(student)
        await teacher.save()
       
        if(teacher.slots.length===1)
        {

            teacher.availability=false
            // res.status(400).send({message:"Teacher is not available"})
            teacher.slots.splice(req.params.slot,1)
            // console.log(teacherUpdate)
            await teacher.save()
        }
        else
        {
        console.log('ELSE1-----'+teacher)
            teacher.slots.splice(req.params.slot,1)
            await teacher.save()
            console.log('ELSE2-----'+teacher)
        }
        res.render('appointment_page',
        {
            student,
            teacher,
            slot:slotmsg
        })
    }
    catch(error)
    {
        res.status(400).send(error.message)
    }



})



router.get('/student-appointments',auth,async (req,res)=>
{
    try
    {
        const student= await Student.findById(req.student.id)
        await student.populate('teacher')
        res.send(student.teacher)
    }
    catch(error)
    {
        res.status(400).send(error)
    }
})

router.get('/cancel-appointment',auth,async(req,res)=>
{
    
    try{
        const student=await Student.findOne({_id:req.student._id})
        await student.populate('teacher')
        // console.log(student)
        const teacher=await Teacher.findById(student.teacher.id)
        // console.log(teacher);



        teacher.availability=true
        await teacher.save()

        student.teacher=null
        await student.save()
        res.status(200).redirect('/home')
    }
    catch(error)
    {
        res.status(400).send(error)
    }

})

// router.get('/appointments',auth,async (req,res)=>
// {
//     console.log(req.student._id)
//     const appointments=await Appointment.find({_id:req.student._id})
//     // console.log(appointments)


//         // await student.populate('teacher')
//         // res.render('appointments',{
//         //     student
//         // })



   

// })



module.exports=router;










