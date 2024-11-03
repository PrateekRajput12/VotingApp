const express=require("express")
const router = express.Router()

const User=require("./../models/user")
const {jwtAuthMiddleware,generateToken}=require("./../jwt")

const mongoose=require("mongoose")

router.post("/signup",async(req,res)=>{
     try{
       
        const data=req.body
        const aadharCardNumber=req.body

        const newUser=new User(data)
        // console.log(newUser);
        const response=await newUser.save()
  
        
        // console.log("Data Saved");
        const payload={
            id:response.id,
        }
        console.log(JSON.stringify(payload));
        const token=generateToken(payload)
        console.log("Token is Generated",);
        res.status(200).json({response:response,token:"token generated"})
     }catch(err){
console.log(err,"error in routes");
res.status(500).json({error:"Internal Server Error"})
     }
})


// Login


router.post("/login",async(req,res)=>{
    try{
        const {aadharCardNumber,password}=req.body
const user=await User.findOne({aadharCardNumber:aadharCardNumber})

if(!user || !(await user.comparePassword(password))){
    return res.status(401).json({error:"Invalid username Or Password"})
}
const payload={
    id:user.id
}
const token =generateToken(payload)
res.json({token})
    }catch(e){
console.log(e);
res.status(500).json({error:"Internal Server error"})
    }
})



// Profile Route


router.get('./profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData=req.user
        console.log("User Data",userData);
        const userId=userData.id
        const user=await personalbar.findById(userId)
        res.status(200).json({user})
    }
    catch(e){
console.error(err);
res.status(500).json({error:"Internal Server Error"})
    }
})


router.put("/profile/password",jwtAuthMiddleware,async(req,res)=>{
    try{
const userId=req.user.id

const {currentPassword,newPassword}=req.body

const user=await User.findById(userId)
if(!user || !(await user.comparePassword(password))){
    return res.status(401).json({error:"Invalid username Or Password"})
}

user.password=newPassword
await user.save()

console.log("Password Updated");
res.status(200).json({message:"Password Updated"})
    }catch(E){
console.log(E);
    }
})

module.exports=router