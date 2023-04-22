const express=require('express');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const registerModel=require("../Schema/registerschema.js"); 
const registerUserModel = require('../Schema/userSchema/registeruser.js');
const {requireLogin} = require('../middleware/auth.js')

const proposalModel = require("../Schema/proposalSchema.js")
const router=express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}))


router.post("/createproposal",async (req,res) => {
 try {
     let {eventName, placeOfEvent,proposalType,eventType, budget,fromDate, toDate,foodPreference,description ,events,images} = req.body;

        let proposalData =  await new proposalModel({
            eventName, placeOfEvent,proposalType,eventType, budget,fromDate, toDate,foodPreference,description ,events,images
        });
        const data = await proposalData.save();
        res.send(data) 
       
} catch(error)
{
    res.send(error)
}
 });


 router.get("/proposals",async (req,res) => {
   

    
   try{ 
    const proposals = await proposalModel.find();
    res.send(proposals);
   }catch (err){
     console.log(err)
}
 });

 router.post("/vendordata" , async (req,res) => {
    const {token} = req.body;
    try{
        const vendor = jwt.verify(token,"secret_key")
        const vendoremail = vendor.email;
        registerModel.findOne({email: vendoremail}).then((data) => {

            res.send({status :"ok", data :data });
        }).catch((error)=> {
            res.send({status :"error", data :error })
        });
    }catch(error){
        res.send({ status : "error"});
    }
 })

 
router.post("/register",async (req,res)=>{

    let {name,email,contact,password}=req.body;
    try
  
    {
        // console.log(req.body);
        const oldVender =await registerModel.findOne({email})
        if (oldVender){
           return res.send({  status : "error", error : "User Exist"})
        }
        
            let securepass=await bcrypt.hash(password,10)
            console.log(securepass);
           await registerModel.create({
               name:name,
               email:email,
               contact:contact,
               password:securepass,
               
            });
           
            res.send({ status : "ok"});
    }
    catch (error)
    {
        res.send({ status : "error"});
    }
})


router.post("/login",async (req,res)=>{

    const {email,password}=req.body;

    try {
    const vendor =await registerModel.findOne({email});
    if (!vendor){
        return res.json({ status  : "error",  error : "User not found"})
    }
    if ( await bcrypt.compare(password,vendor.password) )
    {
        const token= await jwt.sign({_id : vendor._id, email:vendor.email,},"secret_key")
        if (res.status(201)){
            return res.json({status :"ok" , data : token});
        }else {
            return res.json({ error : "error"});
        }
  
    }
    res.json({status  : "error" , error : "Invalid Password"})

    } catch (err){
      res.send(err)
    }
});
//     try
//     {
        
        
//         let data=await registerModel.findOne({email:email})
//         console.log(data)
//         if(data)
//         {
//             let match=await bcrypt.compare(password,data.password)
//             if(match)
//             {
//                 const token=await jwt.sign({_id : data._id, email:data.email,},"secret_key")
                

//             //    res.cookie("jwttoken",token,{
//             //     expires:new Date(Date.now() + 25892000000) 
                
//             //    })
//                res.json({token});

//             }
//             else
//             {
//                 res.json({"message": "worong password"})
//             }
//         }
//         else
//         {
//             res.json( {"message" : "not registered"})
//         }
//     }
//     catch (error)
//     {
//         res.send(error)
//     }
// })




router.post("/user/register",async (req,res)=>{
    try
  
    {
        // console.log(req.body);
        let {name,email,contact,password,conformpassword}=req.body;
        if(password===conformpassword)
        {
            let securepass=await bcrypt.hash(password,10)
            console.log(securepass);
            let registerDoc=await new registerUserModel({
               name:name,
               email:email,
               contact:contact,
               password:securepass,
               conformpassword:conformpassword
            })
           const data= await registerDoc.save();
            res.send(data)
        }
        else
        {
            res.send("password is not matching")
        }
    }
    catch (error)
    {
        res.send(error)
    }
})





router.post("/user/login",async (req,res)=>{
    try
    {
        let {email,password}=req.body;
        let data=await registerUserModel.findOne({email:email})
        if(data)
        {
            let match=await bcrypt.compare(password,data.password)
            if(match)
            {
                const token=await jwt.sign({email:data.email},"secret_key")
                console.log(token)
                
               res.cookie("jwt",token,{
                expires:new Date(Date.now() + 25892000000)
               })
                   res.send("login")
            }
            else
            {
                res.send("worong password")
            }
        }
        else
        {
            res.send("not registered")
        }
    }
    catch (error)
    {
        res.send(error)
    }
})


module.exports=router