const express=require("express")
const router = express.Router()
const User=require("./../models/user")
const Candidate=require("./../models/candidate")
const {jwtAuthMiddleware,generateToken}=require("./../jwt")

const mongoose=require("mongoose")

const checkAdminRole=async (userId)=>{
try{
const user=await User.findById(userId)
if( user.role==="admin"){
    return true
}
}catch(e){
return false
}
}


router.post("/",jwtAuthMiddleware,async(req,res)=>{
     try{
       if(! await checkAdminRole(req.user.id)){
        return res.status(403).json({message:"user does not have admin role "})
       }
        const data=req.body

        const newCandidate=new Candidate(data)
        console.log(newUser);
        const response=await newCandidate.save()
  
        
        console.log("Data Saved");
    

        res.status(200).json({response:response})
     }catch(err){
console.log(err,"error in routes");
res.status(500).json({error:"Internal Server Error"})
     }
})

// Put Candidate

router.put("/:candidateID",jwtAuthMiddleware,async (req,res)=>{
   try{
    if(! await checkAdminRole(req.user.id)){
        return res.status(403).json({message:"user does not have admin role "})
       }

       const candidateID=req.params.id
       const updatedCandidateData=req.body

       const response=await Candidate.findByIdAndUpdate(candidateID,updatedCandidateData,{
        new:true,
        runValidators:true
       })
       if(!response)
       return res.status(404).json({error:"Candidate not found"})
       console.log("Candidate Data Updated");
       res.status(200).json(response)
   } 
   catch(e){
console.log(e);
res.status(500).json({error:"Internal Server Error in Updating Candidate Data"})
   }
})


// Delete 
router.delete("/:candidateID",jwtAuthMiddleware,async (req,res)=>{
    try{
     if(! await checkAdminRole(req.user.id)){
         return res.status(403).json({message:"user has not admin role "})
        }
 
        const candidateID=req.params.id
        // const updatedCandidateData=req.body
 
        const response=await Candidate.findByIdAndDelete(candidateID)
        if(!response)
        return res.status(404).json({error:"Candidate not found"})
        console.log("Candidate Deleted");
        res.status(200).json(response)
    } 
    catch(e){
 console.log(e);
 res.status(500).json({error:"Internal Server Error in Deleting  Candidate "})
    }
 })
 


// Lets start voting



router.post("/vote/:candidateID",jwtAuthMiddleware,async(req,res)=>{
// no admin ca n vote 

// user can only vote once
const candidateID=req.params.candidateID
 const userId=req.user.id

try{
const candidate=await Candidate.findById(candidateID)
if(!candidate){
   return res.status(404).json({message:"Candidate not found"})
}
const user=await User.findById(userId)
if(!user){
   return res.status(404).json({message:"user not found"})
}
if(user.isVoted){
   res.status(400).json({message:"You Have Already Voted"})
}
if(user.role=="admin"){
   res.status(400).json({message:"Admin is not allowed"})
}


candidate.votes.push({user:userId})
candidate.voteCount++
await candidate.save()

// update the uer document 

user.isVoted=true
await user.save()

res.status(200).json({message:"Vote recorded succesfully "})
}catch(e){
console.log(e);
res.status(500).json({error:"Internal Server Error"})
}
})

// Vote Count 

router.get("/vote/count",jwtAuthMiddleware,async(req,res)=>{
   try{
const candidate=await Candidate.find().sort({voteCount:'desc'})
const voteRecord=candidate.map((data)=>{
   return {
      party:data.party,
      count:data.voteCount
   }
})
return res.status(200).json(voteRecord)
   }catch(E){
console.log(E)
   }
})



router.get("/candidate",async(req,res)=>{
   try{
// list of canddidate 


   }catch(e){

   }
})

module.exports=router