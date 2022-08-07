const jwt=require('jsonwebtoken')
const Student=require('../models/student')


const auth= async (req,res,next)=>
{
    try
    {   
        const token=req.cookies.jwtoken;
        const decoded=await jwt.verify(token,'thisismysecretkey')
        const student=await Student.findOne({_id:decoded._id,'tokens.token':token})
        req.student=student
        req.token=token
        if(student){ 
            next() 
        }
        else { 
            res.redirect('/student-login') 
            }
    }
    catch(error)
    {
        res.status(400).redirect('/')
    }

}

module.exports=auth