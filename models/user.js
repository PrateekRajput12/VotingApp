const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
// const User=require()
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true

    },
    email:{
        type:String,
    },
    number:{
        type:Number
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["voter","admin"],
        default:"voter"
    },
    isVoted:{
        type:Boolean,
        default:false
    }
})

userSchema.pre('saves',async function(next){
    const person=this
    if(!person.isModified("password")) return next()

    try{
        const salt= await bcrypt.genSalt()
        const hashedPassword=await bcrypt.hash(person.password,salt)

        person.password=hashedPassword
        next()
    }
    catch(E){
        return next(E)
    }
})



userSchema.methods.comparePassword=async function(CandidatePassword){
    try{
        const isMatch=await bcrypt.compare(CandidatePassword,this.password)
        return isMatch
    }catch(e){
        console.log(e);
        throw e
    }
}

const User=mongoose.model("User",userSchema)
module.exports=User;