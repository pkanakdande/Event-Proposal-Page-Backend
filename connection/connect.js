const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://pkanakdande:10xacademy@cluster1.rnu1bgi.mongodb.net/?retryWrites=true&w=majority")
.then(res=>{
    console.log("connected")
})
.catch(res=>{
    console.log("error")
})