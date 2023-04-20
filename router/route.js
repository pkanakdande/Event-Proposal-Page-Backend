const express=require('express');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const registerModel=require("../Schema/registerschema.js");
const registerUserModel = require('../Schema/userSchema/registeruser.js');
const router=express.Router();
const cors=require("cors")
router.use(cors())
router.use(express.json());
router.use(express.urlencoded({extended:true}))


router.get("/",(req,res)=>{
    res.send("Hello World")
})
router.post("/register",async (req,res)=>{
    try
  
    {
        // console.log(req.body);
        let {name,email,contact,password,conformpassword}=req.body;
        if(password===conformpassword)
        {
            let securepass=await bcrypt.hash(password,10)
            console.log(securepass);
            let registerDoc=await new registerModel({
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


router.post("/login",async (req,res)=>{
    try
    {
        // console.log(req.body)
        let {email,password}=req.body;
        let data=await registerModel.findOne({email:email})
        console.log(data)
        if(data)
        {
            let match=await bcrypt.compare(password,data.password)
            if(match)
            {
                const token=await jwt.sign({email:data.email},"secret_key")
                console.log(token)

               res.cookie("jwttoken",token,{
                expires:new Date(Date.now() + 25892000000) //1yr
                
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




router.post("/user/register",async (req,res)=>{
    console.log(req.body)
   try
  
    {
        console.log(req.body);
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
             res.json({
                message:"hello"
             })
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
        let data=await registerUserModel.find({email:email})
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