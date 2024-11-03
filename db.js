const mongoose=require("mongoose")

require('dotenv').config()

const mongoURL=process.env.MONGODB_URL


mongoose.connect(mongoURL)

const db=mongoose.connection

db.on("connected",()=>{
    console.log("Connect To MongoDB Server");
})
db.on("error",(err)=>{
    console.log("MongoDB COnnection Error:    EROR IN DB",err);
})
db.on("diconnnected",()=>{
    console.log(" MongoDB Disconnected");
})


 module.exports=db