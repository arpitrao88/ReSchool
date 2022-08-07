const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const studentSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
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
    age:
    {
        type:Number,
        required:true,   
        validate(value)
        {
            if(value<0)
            {
                throw new Error('Please Re-Check the age')
            }
        }
    },
    password:
    {
        type:String,
        required:true,
        trim:true,
        validate(value)
        {
            if(value.toLowerCase()==='password')
            {
                throw new Error("Password cannot be 'password'")
            }
        }
    },
    tokens:[{
        token:
        {
            type:String,
            required:true
        }
    }
    ],
    teacher:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Teacher'
    }

})

studentSchema.methods.generateAuthToken=async function()
{
    const token=jwt.sign({_id:this._id},'thisismysecretkey')
    return token
}

studentSchema.statics.findByCredentials=async(email,password)=>
{
    const student= await Student.findOne({email:email})


    if(!student)
    {
        throw new Error("No Such student exists!")
    }

    const isMatch=await bcrypt.compare(password,student.password)


    if(!isMatch)
    {
        throw new Error('Wrong Password')
    }

    return student


}







studentSchema.pre('save',async function(next)
{
    const student=this;

    if(student.isModified('password'))
    {
        student.password=await bcrypt.hash(student.password,10)
    }
    next()
} )


const Student=new mongoose.model('Student',studentSchema)

module.exports=Student