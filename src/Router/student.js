const router=require('express').Router()
const Student=require('../models/student')
const Teacher=require('../models/teacher')
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
router.get('/home',auth,async (req,res)=>
{
    try{


        const teacher=await Teacher.find({availability:true})
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

router.post('/select-teacher',auth,async function (req,res)
{
    try{
        // console.log(req.body.id)
        // console.log(req.body.time)
        const teacher=await Teacher.findOne({_id:req.body._id,availability:true})
        // // console.log(teacher)
        // // console.log(req.params.student)
        if(!teacher)
        {
            res.status(400).send({message:"Teacher is not available"})
        }
        // teacher.availability=false;
        if(teacher.slots.length===1)
        {
            teacher.availability=false
            // res.status(400).send({message:"Teacher is not available"})
            teacher.slots.splice(req.body.slot,1)
            // console.log(teacherUpdate)
            await teacher.save()
        }
        else
        {
            teacher.slots.splice(req.body.slot,1)
            // console.log(teacherUpdate)
            await teacher.save()
        }
     
        const student=await Student.findOne({_id:req.student.id})
        // // console.log(student)
        student.teacher=teacher
        await student.save()
        await teacher.save()
        console.log('reached')
        res.render('appointment_page',
        {Message:'Booked Your Appointment!',
        teacher,
        student})
       

    }
    catch(error)
    {
        res.status(400).send()
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

router.get('/appointments',auth,async (req,res)=>
{
    const student=await Student.findOne({_id:req.student._id})


        await student.populate('teacher')
        res.render('appointments',{
            student
        })



   

})



module.exports=router;