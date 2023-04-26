const dotenv = require('dotenv'); 
 
dotenv.config();
const mongoose=require("mongoose")
const url =process.env.DB_URL
mongoose.connect(url)
.then(res=>{
    console.log("connected") 
})
.catch(res=>{
    console.log("error:" + res) 
})
