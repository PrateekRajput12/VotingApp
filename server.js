const express=require("express")
const app=express()
require("dotenv").config()
const db=require('./db')

// app.use(express.json())
const bodyParser=require("body-parser")

app.use(bodyParser.json())
const PORT=process.env.PORT || 3000


const userRoutes=require("./routes/userRoutes")


app.use("/user",userRoutes)

app.listen(PORT,()=>{
    console.log("Listening on port 3000");
})