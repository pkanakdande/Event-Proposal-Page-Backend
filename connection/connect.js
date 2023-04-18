const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/Vender-api")
.then(res=>{
    console.log("connected")
})
.catch(res=>{
    console.log("error")
})