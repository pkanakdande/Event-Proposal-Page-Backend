const mongoose=require("mongoose")
const url = "mongodb+srv://mohitsahu1993:mohitsahu@cluster0.uqnigqq.mongodb.net/test"
mongoose.connect("mongodb://localhost:27017/Vender-api")
.then(res=>{
    console.log("connected")
})
.catch(res=>{
    console.log("error")
})
