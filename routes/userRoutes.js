const express=require("express")
const router = express.Router()

const User=require("./../models/user")
const {jwtAuthMiddleware,generateToken}=require("./../jwt")

const mongoose=require("mongoose")

router.post("/signup",async(req,res)=>{
     try{
       
        const data=req.body
        const aadharCardNumber=req.body
// check id there is already an admin user
const adminUser=await User.findOne({role:'admin'})
if(data.role==="admin" && adminUser){
    return res.status(400).json({error:'Admin User Already exists'})

}
// Validate Adhar number Must have 12 digits
if (!/^\d{12}$/.test(data.aadharCardNumber)) {
    return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
}
// check if user with same adharcard number already exist
const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
if (existingUser) {
    return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
}

// create new user using mongo model 

        const newUser=new User(data)
        // console.log(newUser);
        const response=await newUser.save()
  
        
        console.log("Data Saved");
        const payload={
            id:response.id,
        }
        console.log(JSON.stringify(payload));
        const token=generateToken(payload)
        console.log("Token is Generated",token);
        res.status(200).json({response:response,token:token})
     }catch(err){
console.log(err,"error in routes");
res.status(500).json({error:"Internal Server Error"})
     }
})


// Login


router.post("/login",async(req,res)=>{
    try{
        const {aadharCardNumber,password}=req.body

        // check if adhar card number od password is missing
        if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }
        // find user by adharcard number
const user=await User.findOne({aadharCardNumber:aadharCardNumber})
console.log(user);
// if user doest not exist ir password does bot matc , return error
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
// ceheck if currt password and nre password are present in the request body
if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
}
// find th user by id

const user=await User.findById(userId)

// if user does not  exist or passwod doest not match return error
if(!user || ! (await user.comparePassword(password))){
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