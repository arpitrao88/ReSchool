const router=require('express').Router()
const Teacher=require('../models/teacher')


router.post('/teacher-signup',async (req,res)=>
{

    try
    {

    const teacher=new Teacher(req.body)
    await teacher.save()
    res.send(teacher)


    }
    catch(error)
    {
        res.status(400).send(error)
    }
    


})
router.post('/add-slots',async (req,res)=>
{
    try{
        
        const teacher=await Teacher.findOne({_id:req.body.id})
        // for(var i=0;i<teacher.slots.length;i++)
        // {
            // console.log(teacher.slots)
            // }
            teacher.slots.push({time:req.body.time})
        await teacher.save()
        res.status(200).send(teacher)
    }
    catch(error)
    {
        res.status(400).send(error.message)
    }
})





module.exports=router